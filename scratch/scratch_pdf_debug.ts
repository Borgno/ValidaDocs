import { PDFParse } from "pdf-parse";
import * as fs from "fs";

const buf = fs.readFileSync("/home/penta/ValidaDocs/comprovantes.pdf");
const parser = new PDFParse({ data: buf });
const result = await parser.getText();

// Pega as primeiras 3 páginas do texto
const pages = result.pages || [];
console.log(`Total de páginas detectadas: ${pages.length || 'N/A'}`);
console.log("\n=== TEXTO DA PÁGINA 1 ===");
console.log(result.text.slice(0, 1500));
