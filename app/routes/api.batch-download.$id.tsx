import { type LoaderFunctionArgs } from "react-router";
import { prisma } from "../services/db.server";
import { downloadFromMinIO } from "../services/storage.server";
import JSZip from "jszip";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    return new Response("Missing ID", { status: 400 });
  }

  const children = await prisma.document.findMany({
    where: {
      automationType: "CONCILIACAO_CTE",
      originalStorageKey: { contains: `batch-${params.id}` },
      originalName: { startsWith: "Página" }
    }
  });

  if (!children.length) {
    return new Response("No files found", { status: 404 });
  }

  const zip = new JSZip();

  for (const child of children) {
    const storageKey = child.processedStorageKey || child.originalStorageKey;
    if (!storageKey) continue;
    
    try {
      const buffer = await downloadFromMinIO(storageKey);
      const name = child.processedName || child.originalName + ".pdf";
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
      "Content-Disposition": `attachment; filename="lote-comprovantes.zip"`
    }
  });
}
