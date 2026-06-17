import * as xlsx from "xlsx";

export interface ParsedExcelData {
  headers: string[];
  rows: any[][];
}

/**
 * Parses an Excel spreadsheet buffer dynamically.
 * Reads the column mapping from the first row and outputs all columns and rows.
 * 
 * @param buffer Excel file buffer
 * @returns Parsed headers and rows
 */
export function parseExcelToRawRows(buffer: Buffer): ParsedExcelData {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet);

  if (rawRows.length === 0) {
    return { headers: [], rows: [] };
  }

  // First row of sheet_to_json corresponds to row index 1 in the sheet (column map)
  const columnMap = rawRows[0] as Record<string, string>;
  const headers = Object.values(columnMap);
  const keys = Object.keys(columnMap);

  const rows: any[][] = [];
  for (let ri = 1; ri < rawRows.length; ri++) {
    const rowObj = rawRows[ri];
    const rowArr: any[] = [];
    
    for (const key of keys) {
      rowArr.push(rowObj[key] !== undefined ? rowObj[key] : "");
    }
    
    rows.push(rowArr);
  }

  return { headers, rows };
}
