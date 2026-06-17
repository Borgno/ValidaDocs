import * as xlsx from "xlsx";
import * as fs from "fs";
import { PDFParse } from "pdf-parse";

// ===== EXCEL =====
const excelBuf = fs.readFileSync("/home/penta/ValidaDocs/39818_rel_titulo_debito_detalhado_20260615_093715.xlsx");
const workbook = xlsx.read(excelBuf, { type: "buffer" });
const ws = workbook.Sheets[workbook.SheetNames[0]];
const rawRows: Record<string, any>[] = xlsx.utils.sheet_to_json(ws);
const columnMap = rawRows[0] as Record<string, string>;
const excelData: Array<{Nome: string; Valor_Pago: number; CTE: string}> = [];
for (let ri = 1; ri < rawRows.length; ri++) {
  const weirdRow = rawRows[ri] as Record<string, any>;
  const clean: Record<string, any> = {};
  for (const weirdKey in columnMap) clean[columnMap[weirdKey]] = weirdRow[weirdKey];
  if (!clean["nm_pessoa"]) continue;
  const rawVal = clean["vl_pago"];
  const valorPago = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal).replace(/\./g, "").replace(",", "."));
  excelData.push({ Nome: String(clean["nm_pessoa"]).trim(), Valor_Pago: isNaN(valorPago) ? 0 : valorPago, CTE: String(clean["nr_carta_frete"] ?? "").trim() });
}

console.log(`Excel: ${excelData.length} registros mapeados`);

// ===== PDF =====
const pdfBuf = fs.readFileSync("/home/penta/ValidaDocs/comprovantes.pdf");
const parser = new PDFParse({ data: pdfBuf });
const pdfResult = await parser.getText();
const fullText = pdfResult.text;

// Extrai nome e valor de cada página
const pageTexts = fullText.split(/--\s*\d+\s*of\s*\d+\s*--/).filter(p => p.trim().length > 50);
console.log(`\nPDF: ${pageTexts.length} páginas encontradas\n`);

const nameRegex = /Nome Destinat[aá]rio:\s*(.+)/i;
const valueRegex = /Valor Total \(R\$\):\s*([\d.,]+)/i;

let matched = 0;
for (let i = 0; i < pageTexts.length; i++) {
  const page = pageTexts[i];
  const nm = page.match(nameRegex)?.[1]?.trim() ?? "NÃO ENCONTRADO";
  const vlRaw = page.match(valueRegex)?.[1] ?? "0";
  const vl = parseFloat(vlRaw.replace(/\./g, "").replace(",", "."));
  
  const candidates = excelData.filter(r => Math.abs(r.Valor_Pago - vl) < 0.01);
  const match = candidates.length === 1 ? candidates[0] : candidates.find(r => r.Nome.includes(nm.split(" ")[0]));
  
  const status = candidates.length > 0 ? `✅ MATCH → CTE ${match?.CTE ?? candidates[0].CTE}` : `❌ SEM MATCH`;
  if (candidates.length > 0) matched++;
  console.log(`[${i+1}] PDF="${nm}" R$${vl} | Excel="${candidates[0]?.Nome ?? "N/A"}" | ${status}`);
}
console.log(`\nTotal: ${matched}/${pageTexts.length} matches`);
