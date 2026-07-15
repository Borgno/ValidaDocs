import { Job } from "bullmq";
import { processConciliacaoLogic, type ExcelRow } from "./engine";
import { downloadFromMinIO, uploadBufferToMinIO } from "../../services/storage.server";
import { prisma } from "../../services/db.server";
import { PDFDocument } from "pdf-lib";
import { PDFParse } from "pdf-parse";
import * as xlsx from "xlsx";

export async function handleConciliacaoJob(job: Job) {
  const { documentId, excelKey } = job.data;
    
  try {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" }
    });

    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || !doc.originalStorageKey) {
      throw new Error("Documento base não encontrado ou sem chave de storage.");
    }

    console.log(`[Worker] Iniciando processamento do documento Pai: ${documentId}`);

    // 1. Download I/O (S3)
    const pdfBuffer = await downloadFromMinIO(doc.originalStorageKey);
    const excelBuffer = await downloadFromMinIO(excelKey);
    
    // 2. Parser do Excel — Lógica N8N: row[0] é o mapa __EMPTY_X → nome_real_da_coluna
    const workbook = xlsx.read(excelBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet);
    
    if (rawRows.length < 2) {
      throw new Error("A planilha Excel não possui dados ou está em formato inválido.");
    }

    // Linha 0 = mapa de colunas (chaves bizarras → nomes reais)
    const columnMap = rawRows[0] as Record<string, string>;
    
    console.log(`[Worker] Mapeando ${rawRows.length - 1} registros do Excel...`);

    // Linha 1+ = dados reais, re-mapeados com os nomes corretos
    const mappedExcelData: ExcelRow[] = [];
    for (let ri = 1; ri < rawRows.length; ri++) {
      const weirdRow = rawRows[ri] as Record<string, any>;
      const clean: Record<string, any> = {};
      for (const weirdKey in columnMap) {
        clean[columnMap[weirdKey]] = weirdRow[weirdKey];
      }
      if (!clean["nm_pessoa"]) continue;
      const rawVal = clean["vl_pago"];
      // Se já é número (xlsx parseia automático), usa direto. Se string BR ("1.234,56"), converte.
      const valorPago = typeof rawVal === "number"
        ? rawVal
        : parseFloat(String(rawVal).replace(/\./g, "").replace(",", "."));
      mappedExcelData.push({
        Nome: String(clean["nm_pessoa"]).trim(),
        Valor_Pago: isNaN(valorPago) ? 0 : valorPago,
        CTE: String(clean["nr_carta_frete"] ?? "").trim(),
      });
    }

    if (mappedExcelData.length === 0) {
      throw new Error("Nenhum registro válido encontrado na planilha após mapeamento.");
    }

    console.log(`[Worker] ${mappedExcelData.length} registros mapeados. Exemplo: ${JSON.stringify(mappedExcelData[0])}`);

    // 3. Fatiamento de PDF (1-para-N) e Instanciação do Lote
    console.log(`[Worker] Lendo PDF original unificado...`);
    const unifiedPdf = await PDFDocument.load(pdfBuffer);
    const totalPages = unifiedPdf.getPageCount();
    console.log(`[Worker] O PDF possui ${totalPages} página(s). Iniciando fatiamento...`);

    for (let i = 0; i < totalPages; i++) {
      // Extrai a página individual do buffer monolítico
      const singlePdf = await PDFDocument.create();
      const [copiedPage] = await singlePdf.copyPages(unifiedPdf, [i]);
      singlePdf.addPage(copiedPage);
      const singlePdfBytes = await singlePdf.save();
      
      // Aplica o parser NLP no novo blob isolado
      const parser = new PDFParse({ data: Buffer.from(singlePdfBytes) });
      const pdfTextResult = await parser.getText();
      
      // 4. Injetar na Logic Engine pura
      const result = await processConciliacaoLogic(pdfTextResult.text, mappedExcelData);
      
      // 5. Salva Fisicamente (MinIO) o singlePDF como artefato atômico
      const folderPrefix = result.success ? "matched" : "unmatched";
      const processedStorageKey = result.success 
        ? `conciliacao/matched/batch-${documentId}/${result.newFileName}`
        : `conciliacao/unmatched/batch-${documentId}/page-${i}-${result.newFileName}`;
      const processedFile = Buffer.from(singlePdfBytes);
      await uploadBufferToMinIO(processedFile, processedStorageKey);

      // 6. DB: Persiste o Filho (Comprovante Isolado) atrelado ao usuário pai
      await prisma.document.create({
        data: {
          userId: doc.userId,
          originalName: `Página ${i + 1} do Lote`,
          processedName: result.newFileName,
          originalStorageKey: processedStorageKey, 
          processedStorageKey: processedStorageKey,
          automationType: "CONCILIACAO_CTE",
          status: result.success ? "COMPLETED" : "FAILED",
          extractedData: result as any,
          processedAt: new Date(),
          errorMessage: result.errorMessage
        }
      });
      
      console.log(`[Worker] Página ${i + 1}/${totalPages} processada: ${result.newFileName}`);
    }

    // 7. Update Transacional do Documento "Pai" (O Lote/Payload Base)
    await prisma.document.update({
      where: { id: documentId },
      data: { 
        status: "COMPLETED",
        processedAt: new Date(),
        processedName: 'Lote Processado'
      }
    });
    console.log(`[Worker] ✅ Processamento do Lote ${documentId} concluído com sucesso!`);

  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: { 
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unmapped Internal Error"
      }
    });
  }
}
