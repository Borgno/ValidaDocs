import { PDFParse } from 'pdf-parse';
import * as fs from 'fs';

async function test() {
  const parser = new PDFParse();
  console.log("PDFParse instance", parser);
  // test on a dummy file if possible, but we don't have one right now
}
test();
