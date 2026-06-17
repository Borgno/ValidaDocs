import { uploadToMinIO } from "../services/storage.server";
import { enqueueJob } from "../jobs/queue.server";
import { prisma } from "../services/db.server";
import { useLoaderData, useActionData } from "react-router";
import { ConciliacaoView } from "../views/ConciliacaoView";

export async function loader() {
  const documents = await prisma.document.findMany({
    where: { automationType: 'CONCILIACAO_CTE' },
    orderBy: { createdAt: 'desc' }
  });
  return { documents };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const pdfFile = formData.get("pdf") as File;
  const excelFile = formData.get("excel") as File;

  if (!pdfFile || !excelFile || !pdfFile.name || !excelFile.name) {
    return Response.json({ error: "Ambos os arquivos são obrigatórios." }, { status: 400 });
  }

  if (pdfFile.size === 0 || excelFile.size === 0) {
    return Response.json({ error: "Arquivo corrompido ou vazio detectado no upload." }, { status: 400 });
  }

  const timestamp = Date.now();
  const pdfKey = await uploadToMinIO(pdfFile, `raw/pdf-${timestamp}.pdf`);
  const excelKey = await uploadToMinIO(excelFile, `raw/xls-${timestamp}.xlsx`);
  
  await prisma.user.upsert({
    where: { id: "user_mock" },
    update: {},
    create: {
      id: "user_mock",
      username: "admin_teste",
      password: "hashed_password",
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
        excelStorageKey: excelKey
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
