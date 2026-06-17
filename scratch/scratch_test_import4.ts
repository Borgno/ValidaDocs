import * as fs from 'fs';
const { PDFParse } = require('pdf-parse');

async function test() {
  const buf = Buffer.from("dummy");
  console.log(Object.getOwnPropertyNames(PDFParse.prototype));
  console.log(Object.getOwnPropertyNames(PDFParse));
}
test();
