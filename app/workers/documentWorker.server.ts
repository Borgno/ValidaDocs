import { Worker, Job } from "bullmq";
import { redisConnection } from "../services/redis.server";
import { handleConciliacaoJob } from "../domain/conciliacao/handler.server";
import { handleComprovanteFatJob } from "../domain/comprovantes-fat/handler.server";

export const documentWorker = new Worker(
  "DocumentQueue",
  async (job: Job) => {
    console.log(`[DocumentWorker] Recebeu job: ${job.name} (ID: ${job.id})`);
    
    switch (job.name) {
      case "process-conciliacao":
        await handleConciliacaoJob(job);
        break;
      case "process-comprovante-fat":
        await handleComprovanteFatJob(job);
        break;
      default:
        console.warn(`[DocumentWorker] Job desconhecido recebido: ${job.name}`);
    }
  },
  { connection: redisConnection as any, concurrency: 2 }
);
