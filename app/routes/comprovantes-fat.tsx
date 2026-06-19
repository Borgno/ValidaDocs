import { uploadToMinIO, deleteFromMinIO, fileExistsInMinIO } from "../services/storage.server";
import { enqueueJob } from "../jobs/queue.server";
import { prisma } from "../services/db.server";
import { useLoaderData, useActionData } from "react-router";
import { ComprovantesFatView } from "../views/ComprovantesFatView";

export async function loader() {
  const documents = await prisma.document.findMany({
    where: { automationType: 'COMPROVANTE_FAT' },
    orderBy: { createdAt: 'desc' },
  });

  // Purga registros órfãos — arquivos no banco sem correspondência no MinIO
  const orphanIds = (
    await Promise.all(
      documents.map(async (doc) => {
        const exists = await fileExistsInMinIO(doc.originalStorageKey);
        return exists ? null : doc.id;
      })
    )
  ).filter(Boolean) as string[];

  if (orphanIds.length > 0) {
    console.warn(`[Loader] Purging ${orphanIds.length} orphan record(s) from COMPROVANTE_FAT`);
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

  if (!pdfFile || !pdfFile.name) {
    return Response.json({ error: "O arquivo PDF é estritamente obrigatório." }, { status: 400 });
  }

  if (pdfFile.size === 0) {
    return Response.json({ error: "Arquivo corrompido ou vazio detectado no upload." }, { status: 400 });
  }

  const timestamp = Date.now();
  const pdfKey = await uploadToMinIO(pdfFile, `comprovantes-fat/row/comprovante-fat-${timestamp}.pdf`);

  await prisma.user.upsert({
    where: { id: "user_mock" },
    update: {},
    create: {
      id: "user_mock",
      username: "admin_teste",
      password: process.env.MOCK_USER_PASSWORD || "",
    }
  });

  const docRecord = await prisma.document.create({
    data: {
      userId: "user_mock",
      originalName: pdfFile.name,
      originalStorageKey: pdfKey,
      automationType: "COMPROVANTE_FAT",
    }
  });

  await enqueueJob("process-comprovante-fat", { documentId: docRecord.id });

  return Response.json({ success: true, trackingId: docRecord.id });
}

export default function Route() {
  const { documents } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ success?: boolean; error?: string; trackingId?: string }>();

  return <ComprovantesFatView documents={documents} actionData={actionData} />;
}
