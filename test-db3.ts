import { prisma } from "./app/services/db.server";

async function main() {
  const docs = await prisma.document.findMany({
    where: { automationType: 'COMPROVANTE_FAT' },
    orderBy: { createdAt: 'desc' }
  });
  console.log("Documents:", JSON.stringify(docs, null, 2));
}
main().catch(console.error).finally(() => process.exit(0));
