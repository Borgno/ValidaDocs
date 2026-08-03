import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const docs = await prisma.document.findMany({ select: { id: true, originalName: true, automationType: true, extractedData: true, createdAt: true } });
  console.log("Documents in DB:");
  console.log(JSON.stringify(docs, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
