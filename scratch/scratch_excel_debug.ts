import * as xlsx from "xlsx";
import * as fs from "fs";

const buf = fs.readFileSync("/home/penta/ValidaDocs/39818_rel_titulo_debito_detalhado_20260615_093715.xlsx");
const workbook = xlsx.read(buf, { type: "buffer" });
const ws = workbook.Sheets[workbook.SheetNames[0]];

const rawRows: any[][] = xlsx.utils.sheet_to_json(ws, { header: 1 });

console.log("FIRST 5 ROWS OF RAW SPREADSHEET:");
rawRows.slice(0, 5).forEach((row, i) => {
  console.log(`[Row ${i}]:`, row);
});
