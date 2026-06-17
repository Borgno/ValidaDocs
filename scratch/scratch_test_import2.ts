import fs from "fs";
import pdfParse from "pdf-parse";
const file = fs.readFileSync("/home/penta/ValidaDocs/package.json"); // Just dummy buffer
try {
  console.log("pdfParse function?", typeof pdfParse);
} catch (e) { console.error(e); }
