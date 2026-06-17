import { prisma } from "./app/services/db.server";

async function main() {
  const docs = await prisma.document.findMany({
    where: { automationType: 'CONCILIACAO_CTE' },
    orderBy: { createdAt: 'desc' }
  });
  console.log("CONCILIACAO DOCUMENTS IN DB:");
  docs.forEach(d => {
    console.log(`ID: ${d.id} | OriginalName: ${d.originalName} | Status: ${d.status} | ExtractedData:`, d.extractedData);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
