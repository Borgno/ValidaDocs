import { type LoaderFunctionArgs } from "react-router";
import { prisma } from "../../services/db.server";
import { downloadFromMinIO } from "../../services/storage.server";
import JSZip from "jszip";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.date) {
    return new Response("Missing Date", { status: 400 });
  }

  const documents = await prisma.document.findMany({
    where: {
      automationType: "PIX_ADM",
      status: "COMPLETED",
      processedName: { startsWith: params.date }
    }
  });

  if (!documents.length) {
    return new Response("No files found for this date", { status: 404 });
  }

  const zip = new JSZip();

  for (const doc of documents) {
    const storageKey = doc.processedStorageKey || doc.originalStorageKey;
    if (!storageKey) continue;
    
    try {
      const buffer = await downloadFromMinIO(storageKey);
      const name = doc.processedName || doc.originalName + ".pdf";
      zip.file(name, buffer);
    } catch (e) {
      console.error(`Error downloading ${storageKey}`, e);
    }
  }

  const zipContent = await zip.generateAsync({ type: "blob" });

  return new Response(zipContent, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pix-adm-${params.date}.zip"`
    }
  });
}
