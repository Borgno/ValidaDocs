import type { Route } from "./+types/api.document.$id";
import { prisma } from "../services/db.server";
import { downloadFromMinIO } from "../services/storage.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const shouldDownload = url.searchParams.get("download") === "true";
  
  const doc = await prisma.document.findUnique({
    where: { id: params.id }
  });

  if (!doc) {
    return new Response("Document not found", { status: 404 });
  }

  const isCompleted = doc.status === "COMPLETED";
  const isSpreadsheet = url.searchParams.get("spreadsheet") === "true";

  if (isSpreadsheet) {
    const excelKey = (doc.extractedData as any)?.excelStorageKey;
    const excelName = (doc.extractedData as any)?.excelName || "Planilha FAT.xlsx";

    if (!excelKey) {
      return new Response("Storage key for spreadsheet not found.", { status: 404 });
    }

    try {
      const fileBuffer = await downloadFromMinIO(excelKey);
      const safeFileName = encodeURIComponent(excelName).replace(/'/g, "%27");
      const headers = new Headers();
      headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      headers.set("Content-Disposition", `attachment; filename="${excelName}"; filename*=UTF-8''${safeFileName}`);
      return new Response(fileBuffer as any, { headers });
    } catch (error) {
      console.error(`[MinIO Error] Spreadsheet download failed for document ID: ${params.id}`, error);
      return new Response("Planilha física não encontrada no servidor de armazenamento.", { status: 404 });
    }
  }

  const targetKey = isCompleted && doc.processedStorageKey ? doc.processedStorageKey : doc.originalStorageKey;
  const targetName = (isCompleted && doc.processedName && doc.processedName !== "Lote Processado")
    ? doc.processedName
    : doc.originalName;

  try {
    const fileBuffer = await downloadFromMinIO(targetKey);
    
    // Sanitiza o nome para uso seguro no header HTTP (RFC 5987)
    const safeFileName = encodeURIComponent(targetName).replace(/'/g, "%27");
    
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    
    if (shouldDownload) {
      headers.set("Content-Disposition", `attachment; filename="${targetName}"; filename*=UTF-8''${safeFileName}`);
    } else {
      headers.set("Content-Disposition", `inline; filename="${targetName}"; filename*=UTF-8''${safeFileName}`);
    }

    return new Response(fileBuffer as any, { headers });
  } catch (error) {
    console.error(`[MinIO Error] Documento ID: ${params.id} | Falha ao buscar a chave: ${targetKey}`, error);
    return new Response("Arquivo físico não encontrado no servidor de armazenamento.", { 
      status: 404, 
      headers: { "Content-Type": "text/plain" } 
    });
  }
}
