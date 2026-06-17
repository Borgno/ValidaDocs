import { type LoaderFunctionArgs } from "react-router";
import { prisma } from "../services/db.server";
import { downloadFromMinIO } from "../services/storage.server";
import { parseExcelToRawRows } from "../services/excel.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    return Response.json({ error: "Parâmetro ID do lote ausente." }, { status: 400 });
  }

  const doc = await prisma.document.findUnique({
    where: { id }
  });

  if (!doc) {
    return Response.json({ error: "Lote não encontrado." }, { status: 404 });
  }

  const excelKey = (doc.extractedData as any)?.excelStorageKey;
  if (!excelKey) {
    return Response.json({ 
      error: "Este lote foi processado antes da atualização da visualização de planilhas. A planilha original não está disponível para visualização neste registro histórico." 
    }, { status: 404 });
  }

  try {
    const buffer = await downloadFromMinIO(excelKey);
    const data = parseExcelToRawRows(buffer);
    return Response.json(data);
  } catch (error) {
    console.error(`[Excel API Error] Failed parsing sheet for doc ${id}:`, error);
    const message = error instanceof Error ? error.message : "Erro interno no servidor ao ler a planilha.";
    return Response.json({ error: message }, { status: 500 });
  }
}
