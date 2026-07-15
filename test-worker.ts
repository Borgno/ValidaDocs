import { PDFParse } from "pdf-parse";
import fs from "fs";

async function main() {
  const pdfBuffer = fs.readFileSync('docs/sicredi_E0633293120260101172244sz3HUGc2M.pdf');
  const parser = new PDFParse({ data: pdfBuffer });
  const { text } = await parser.getText();
  const codigo = text.split("\n")[1]?.trim() || "SEM_CODIGO";
  console.log("Codigo extraido:", codigo);
}
main().catch(console.error);
