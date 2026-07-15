import { prisma } from "./app/services/db.server";
import { uploadToMinIO } from "./app/services/storage.server";
import { enqueueJob } from "./app/jobs/queue.server";
import fs from "fs";

async function main() {
  const documentId = crypto.randomUUID();
  const filePath = 'docs/sicredi_E0633293120260101172244sz3HUGc2M.pdf';
  const fileBuffer = fs.readFileSync(filePath);
  
  // Mock File interface
  const pdfFile = {
    name: 'sicredi_E0633293120260101172244sz3HUGc2M.pdf',
    type: 'application/pdf',
    arrayBuffer: async () => fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength),
  } as any as File;

  const pdfKey = await uploadToMinIO(pdfFile, `comprovantes-fat/row/doc-${documentId}/${pdfFile.name}`);

  const docRecord = await prisma.document.create({
    data: {
      id: documentId,
      userId: "user_mock",
      originalName: pdfFile.name,
      originalStorageKey: pdfKey,
      automationType: "COMPROVANTE_FAT",
      status: "PENDING",
    }
  });

  console.log("Document created, enqueuing job:", documentId);
  await enqueueJob("DocumentQueue", "process-comprovante-fat", { documentId });

  // Wait for worker to process it
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const updated = await prisma.document.findUnique({ where: { id: documentId } });
    console.log(`Status: ${updated?.status}`);
    if (updated?.status === "COMPLETED" || updated?.status === "FAILED") {
      console.log("Final Record:", JSON.stringify(updated, null, 2));
      break;
    }
  }
}

main().catch(console.error).finally(() => process.exit(0));
