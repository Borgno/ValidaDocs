import { Worker, Job, Queue } from "bullmq";
import { redisConnection } from "../services/redis.server";
import { prisma } from "../services/db.server";
import { deleteBatchFilesFromMinIO } from "../services/storageDelete.server";

const CLEANUP_QUEUE_NAME = "CleanupQueue";

export const cleanupQueue = new Queue(CLEANUP_QUEUE_NAME, {
  connection: redisConnection as any,
});

cleanupQueue.add("cleanup-old-documents", {}, { repeat: { pattern: "0 3 * * *" } })
  .catch(err => console.error("[CleanupQueue] Erro ao agendar job de limpeza:", err));

export const cleanupWorker = new Worker(
  CLEANUP_QUEUE_NAME,
  async (job: Job) => {
    console.log(`[CleanupWorker] Iniciando rotina de limpeza orientada a Lote (Batch)...`);
    
    // Calcula a data limite: 14 dias (2 semanas) atrás
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 14);

    // 1. Busca documentos "Pai" (aqueles que geraram os lotes)
    const oldBatches = await prisma.document.findMany({
      where: {
        createdAt: { lt: thresholdDate },
        // Garante que só pegamos os arquivos pai verificando a string de automação
        automationType: { in: ["CONCILIACAO_CTE", "COMPROVANTE_FAT", "PIX_ADM"] }
      },
    });

    console.log(`[CleanupWorker] Encontrados ${oldBatches.length} lotes para exclusão total.`);

    for (const batch of oldBatches) {
      try {
        console.log(`[CleanupWorker] Limpando lote físico do MinIO: ${batch.id}`);
        // 2. Apaga TODOS os arquivos no MinIO que pertençam a esta pasta/lote
        await deleteBatchFilesFromMinIO(batch.id);

        // 3. Apaga os "filhos" desse lote do banco (caso existam) para evitar chave estrangeira
        await prisma.document.deleteMany({
          where: { originalStorageKey: { contains: batch.id } }
        });

      } catch (error) {
        console.error(`[CleanupWorker] Erro ao processar lote ${batch.id}:`, error);
      }
    }

    // 4. Apaga os registros dos lotes originais do banco de dados
    if (oldBatches.length > 0) {
      const batchIds = oldBatches.map(b => b.id);
      await prisma.document.deleteMany({ where: { id: { in: batchIds } } });
      console.log(`[CleanupWorker] ${batchIds.length} lotes (e seus metadados) removidos do banco.`);
    }
  },
  { connection: redisConnection as any, concurrency: 1 }
);
