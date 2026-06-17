import { Worker, Job } from "bullmq";
import { redisConnection } from "../services/redis.server";
import { downloadFromMinIO } from "../services/storage.server";
import { prisma } from "../services/db.server";
import { PDFParse } from "pdf-parse";

export const comprovanteFatWorker = new Worker(
  "DocumentQueue",
  async (job: Job) => {
    if (job.name !== "process-comprovante-fat") return;

    const { documentId } = job.data;

    try {
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "PROCESSING" },
      });

      const doc = await prisma.document.findUnique({ where: { id: documentId } });
      if (!doc?.originalStorageKey) throw new Error("Documento não encontrado.");

      // 1. Download do PDF
      const pdfBuffer = await downloadFromMinIO(doc.originalStorageKey);

      // 2. Extrai texto
      const parser = new PDFParse({ data: pdfBuffer });
      const { text } = await parser.getText();

      // Lógica idêntica ao N8N: pega a linha 1 do texto bruto
      const codigo = text.split("\n")[1]?.trim() || "SEM_CODIGO";

      const processedName = `${codigo}.pdf`;
      console.log(`[ComprovanteFAT] Código extraído: "${codigo}" → renomeando para: ${processedName}`);

      // 4. Atualiza o nome no banco
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: "COMPLETED",
          processedName,
          processedAt: new Date(),
        },
      });

      console.log(`[ComprovanteFAT] ✅ Documento ${documentId} renomeado com sucesso.`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro interno";
      console.error(`[ComprovanteFAT] ❌ ${msg}`);
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "FAILED", errorMessage: msg },
      });
    }
  },
  { connection: redisConnection as any, concurrency: 2 }
);
