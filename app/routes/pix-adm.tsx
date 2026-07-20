import { uploadToMinIO, deleteFromMinIO, fileExistsInMinIO } from "../services/storage.server";
import { enqueueJob } from "../jobs/queue.server";
import { prisma } from "../services/db.server";
import { useLoaderData, useActionData } from "react-router";
import { PixAdmView } from "../views/PixAdmView";

export async function loader() {
  const documents = await prisma.document.findMany({
    where: { automationType: 'PIX_ADM' },
    orderBy: { createdAt: 'desc' },
  });

  // Purga registros órfãos — arquivos no banco sem correspondência no MinIO
  const orphanIds = (
    await Promise.all(
      documents.map(async (doc) => {
        const exists = await fileExistsInMinIO(doc.processedStorageKey || doc.originalStorageKey);
        return exists ? null : doc.id;
      })
    )
  ).filter(Boolean) as string[];

  if (orphanIds.length > 0) {
    console.warn(`[Loader] Purging ${orphanIds.length} orphan record(s) from PIX_ADM`);
    await prisma.document.deleteMany({ where: { id: { in: orphanIds } } });
  }

  const validDocuments = documents.filter((d) => !orphanIds.includes(d.id));
  return { documents: validDocuments };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "delete") {
    const id = formData.get("id") as string;
    if (!id) return Response.json({ error: "ID é obrigatório para exclusão" }, { status: 400 });

    try {
      const doc = await prisma.document.findUnique({ where: { id } });
      if (!doc) return Response.json({ error: "Documento não encontrado" }, { status: 404 });

      const keysToDelete = new Set([doc.originalStorageKey, doc.processedStorageKey].filter(Boolean) as string[]);
      await Promise.all([...keysToDelete].map(deleteFromMinIO));
      await prisma.document.delete({ where: { id } });

      return Response.json({ success: true });
    } catch (err: any) {
      return Response.json({ error: err.message || "Erro ao deletar" }, { status: 500 });
    }
  }


  const pdfFile = formData.get("pdf") as File;
  console.log(`[PixADM Action] Recebido arquivo: ${pdfFile?.name} | Tamanho: ${pdfFile?.size}`);

  if (!pdfFile || !pdfFile.name) {
    return Response.json({ error: "O arquivo PDF é estritamente obrigatório." }, { status: 400 });
  }

  if (pdfFile.size === 0) {
    return Response.json({ error: "Arquivo corrompido ou vazio detectado no upload." }, { status: 400 });
  }

  const documentId = crypto.randomUUID();
  console.log(`[PixADM Action] Fazendo upload para o MinIO...`);
  const pdfKey = await uploadToMinIO(pdfFile, `pix-adm/raw/doc-${documentId}/${pdfFile.name}`);
  
  console.log(`[PixADM Action] Upload no MinIO concluído: ${pdfKey}. Criando usuário mock...`);
  await prisma.user.upsert({
    where: { id: "user_mock" },
    update: {},
    create: {
      id: "user_mock",
      username: "admin_teste",
      password: process.env.MOCK_USER_PASSWORD || "",
    }
  });

  console.log(`[PixADM Action] Criando registro no banco de dados...`);
  const docRecord = await prisma.document.create({
    data: {
      id: documentId,
      userId: "user_mock",
      originalName: pdfFile.name,
      originalStorageKey: pdfKey,
      automationType: "PIX_ADM",
    }
  });

  console.log(`[PixADM Action] Adicionando Job na fila process-pix-adm...`);
  await enqueueJob("process-pix-adm", { documentId: docRecord.id });

  console.log(`[PixADM Action] Tudo certo! Retornando sucesso.`);
  return Response.json({ success: true, trackingId: docRecord.id });
}

export default function Route() {
  const { documents } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ success?: boolean; error?: string; trackingId?: string }>();

  return <PixAdmView documents={documents} actionData={actionData} />;
}
