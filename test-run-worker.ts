import { Worker } from "bullmq";
import { redisConnection } from "./app/services/redis.server";
import { downloadFromMinIO } from "./app/services/storage.server";
import { prisma } from "./app/services/db.server";
import { PDFParse } from "pdf-parse";

console.log("Starting temporary worker...");

const worker = new Worker(
  "DocumentQueue",
  async (job) => {
    if (job.name !== "process-comprovante-fat") return;
    const { documentId } = job.data;
    console.log("Processing job for document", documentId);

    try {
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "PROCESSING" },
      });

      const doc = await prisma.document.findUnique({ where: { id: documentId } });
      if (!doc?.originalStorageKey) throw new Error("Documento não encontrado.");

      const pdfBuffer = await downloadFromMinIO(doc.originalStorageKey);
      
      const parser = new PDFParse({ data: pdfBuffer });
      const { text } = await parser.getText();
      
      const codigo = text.split("\n")[1]?.trim() || "SEM_CODIGO";
      const processedName = `${codigo}.pdf`;
      console.log(`Extracted: ${codigo} -> ${processedName}`);

      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "COMPLETED",
          processedName,
          processedAt: new Date(),
        },
      });
      console.log("Completed!");
    } catch (error) {
      console.error("Worker Error:", error);
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "FAILED", errorMessage: error instanceof Error ? error.message : String(error) },
      });
    }
  },
  { connection: redisConnection as any }
);

setTimeout(() => process.exit(0), 10000);
