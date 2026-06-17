import { uploadToMinIO } from "../services/storage.server";
import { enqueueJob } from "../jobs/queue.server";
import { prisma } from "../services/db.server";
import { useLoaderData, useActionData } from "react-router";
import { ComprovantesFatView } from "../views/ComprovantesFatView";

export async function loader() {
  const documents = await prisma.document.findMany({
    where: { automationType: 'COMPROVANTE_FAT' },
    orderBy: { createdAt: 'desc' }
  });
  return { documents };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const pdfFile = formData.get("pdf") as File;

  if (!pdfFile || !pdfFile.name) {
    return Response.json({ error: "O arquivo PDF é estritamente obrigatório." }, { status: 400 });
  }

  if (pdfFile.size === 0) {
    return Response.json({ error: "Arquivo corrompido ou vazio detectado no upload." }, { status: 400 });
  }

  const timestamp = Date.now();
  const pdfKey = await uploadToMinIO(pdfFile, `raw/comprovante-fat-${timestamp}.pdf`);

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
