import { uploadToMinIO, deleteFromMinIO, fileExistsInMinIO } from "../services/storage.server";
import { enqueueJob } from "../jobs/queue.server";
import { prisma } from "../services/db.server";
import { useLoaderData, useActionData } from "react-router";
import { ConciliacaoView } from "../views/ConciliacaoView";

export async function loader() {
  const documents = await prisma.document.findMany({
    where: { automationType: 'CONCILIACAO_CTE' },
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
    console.warn(`[Loader] Purging ${orphanIds.length} orphan record(s) from CONCILIACAO_CTE`);
    await prisma.document.deleteMany({ where: { id: { in: orphanIds } } });
  }

  const validDocuments = documents.filter((d) => !orphanIds.includes(d.id));
  return { documents: validDocuments };
}

// ------- Helpers de deleção em cascata -------

async function deleteChildrenOfBatch(batchId: string) {
  const children = await prisma.document.findMany({
    where: {
      automationType: "CONCILIACAO_CTE",
      originalStorageKey: { contains: `batch-${batchId}` },
    },
  });

  const keys = children.flatMap((c) =>
    [...new Set([c.originalStorageKey, c.processedStorageKey].filter(Boolean))] as string[]
  );
  await Promise.all(keys.map(deleteFromMinIO));
  if (children.length > 0) {
    await prisma.document.deleteMany({ where: { id: { in: children.map((c) => c.id) } } });
  }

  return children.length;
}

async function deleteBatchDoc(batchId: string) {
  const batch = await prisma.document.findUnique({ where: { id: batchId } });
  if (!batch) return;

  const keysToDelete = new Set(
    [batch.originalStorageKey, (batch.extractedData as any)?.excelStorageKey].filter(Boolean)
  );
  await Promise.all([...keysToDelete].map(deleteFromMinIO));
  await prisma.document.delete({ where: { id: batchId } });
}

async function autoDeleteParentIfEmpty(batchId: string) {
  const remainingChildren = await prisma.document.count({
    where: {
      automationType: "CONCILIACAO_CTE",
      originalStorageKey: { contains: `batch-${batchId}` },
    },
  });

  if (remainingChildren === 0) {
    await deleteBatchDoc(batchId);
    return true;
  }
  return false;
}

// ------- Action -------

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "deleteBatch") {
    const id = formData.get("id") as string;
    if (!id) return Response.json({ error: "ID é obrigatório para exclusão" }, { status: 400 });

    try {
      await deleteChildrenOfBatch(id);
      await deleteBatchDoc(id);
      return Response.json({ success: true });
    } catch (err: any) {
      return Response.json({ error: err.message || "Erro ao excluir lote" }, { status: 500 });
    }
  }

  if (actionType === "deleteFile") {
    const id = formData.get("id") as string;
    if (!id) return Response.json({ error: "ID é obrigatório para exclusão" }, { status: 400 });

    try {
      const doc = await prisma.document.findUnique({ where: { id } });
      if (!doc) return Response.json({ error: "Arquivo não encontrado" }, { status: 404 });

      const batchMatch = doc.originalStorageKey?.match(/batch-([a-f0-9-]+)-page/);
      const batchId = batchMatch?.[1] ?? null;

      const keysToDelete = new Set(
        [doc.originalStorageKey, doc.processedStorageKey].filter(Boolean) as string[]
      );
      await Promise.all([...keysToDelete].map(deleteFromMinIO));
      await prisma.document.delete({ where: { id } });

      // Cascata reversa: se todos os filhos sumiram, apaga o pai também
      if (batchId) {
        await autoDeleteParentIfEmpty(batchId);
      }

      return Response.json({ success: true });
    } catch (err: any) {
      return Response.json({ error: err.message || "Erro ao excluir arquivo" }, { status: 500 });
    }
  }

  const pdfFile = formData.get("pdf") as File;
  const excelFile = formData.get("excel") as File;

  if (!pdfFile || !excelFile || !pdfFile.name || !excelFile.name) {
    return Response.json({ error: "Ambos os arquivos são obrigatórios." }, { status: 400 });
  }

  if (pdfFile.size === 0 || excelFile.size === 0) {
    return Response.json({ error: "Arquivo corrompido ou vazio detectado no upload." }, { status: 400 });
  }

  const timestamp = Date.now();
  const pdfKey = await uploadToMinIO(pdfFile, `conciliacao/row/pdf-${timestamp}.pdf`);
  const excelKey = await uploadToMinIO(excelFile, `conciliacao/row/xls-${timestamp}.xlsx`);

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
      automationType: "CONCILIACAO_CTE",
      extractedData: {
        excelName: excelFile.name,
        excelStorageKey: excelKey,
      }
    }
  });

  await enqueueJob("process-conciliacao", { documentId: docRecord.id, excelKey });

  return Response.json({ success: true, trackingId: docRecord.id });
}

export default function Route() {
  const { documents } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ success?: boolean; error?: string; trackingId?: string }>();

  return <ConciliacaoView documents={documents} actionData={actionData} />;
}
