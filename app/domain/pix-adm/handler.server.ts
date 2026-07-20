import { Job } from "bullmq";
import { downloadFromMinIO, uploadBufferToMinIO, deleteFromMinIO } from "../../services/storage.server";
import { prisma } from "../../services/db.server";
import { PDFParse } from "pdf-parse";
import { extractPixAdmData } from "./extractor";

export async function handlePixAdmJob(job: Job) {
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

    // 3. Usa o especialista de domínio (extractor) para processar os dados
    const processedName = extractPixAdmData(text);
    const processedStorageKey = `pix-adm/processed/doc-${documentId}/${processedName}`;
    console.log(`[PixADM] Nome processado pelo especialista: ${processedName}`);

    // 4. Upload do arquivo renomeado de volta para o Storage
    await uploadBufferToMinIO(pdfBuffer, processedStorageKey);

    // 5. Atualiza o banco com o novo nome e o caminho do arquivo processado
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "COMPLETED",
        processedName,
        processedStorageKey,
        processedAt: new Date(),
      },
    });

    console.log(`[PixADM] ✅ Documento ${documentId} processado com sucesso.`);

    if (doc.originalStorageKey) {
      await deleteFromMinIO(doc.originalStorageKey);
      console.log(`[PixADM] 🗑️ Arquivo original (raw) deletado: ${doc.originalStorageKey}`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro interno";
    console.error(`[PixADM] ❌ ${msg}`);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "FAILED", errorMessage: msg },
    });
  }
}
