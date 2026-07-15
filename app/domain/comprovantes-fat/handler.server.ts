import { Job } from "bullmq";
import { downloadFromMinIO, uploadBufferToMinIO } from "../../services/storage.server";
import { prisma } from "../../services/db.server";
import { PDFParse } from "pdf-parse";
import { extractFatName } from "./extractor";

export async function handleComprovanteFatJob(job: Job) {
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

    // 3. Usa o especialista de domínio (extractor) para pegar e formatar o nome
    const processedName = extractFatName(text);
    const processedStorageKey = `comprovantes-fat/processed/doc-${documentId}/${processedName}`;
    console.log(`[ComprovanteFAT] Nome processado pelo especialista: ${processedName}`);

    // 3. Upload do arquivo renomeado de volta para o Storage
    await uploadBufferToMinIO(pdfBuffer, processedStorageKey);

    // 4. Atualiza o banco com o novo nome e o caminho do arquivo processado
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "COMPLETED",
        processedName,
        processedStorageKey,
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
}
