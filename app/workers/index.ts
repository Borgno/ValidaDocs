import { documentWorker } from "./documentWorker.server";
import { cleanupWorker } from "./cleanupWorker.server";

documentWorker.on('completed', job => console.log(`[BullMQ] 🟢 [${job.name}] Job ${job.id} concluído!`));
documentWorker.on('failed', (job, err) => console.log(`[BullMQ] 🔴 [${job?.name}] Job ${job?.id} falhou: ${err.message}`));
documentWorker.on('error', err => console.error(`[BullMQ] 🚨 Erro no Worker Central:`, err));

cleanupWorker.on('completed', job => console.log(`[BullMQ] 🟢 [${job.name}] Limpeza de ${job.id} concluída!`));
cleanupWorker.on('failed', (job, err) => console.log(`[BullMQ] 🔴 [${job?.name}] Limpeza falhou: ${err.message}`));
cleanupWorker.on('error', err => console.error(`[BullMQ] 🚨 Erro no Cleanup Worker:`, err));

console.log("🚀 [ValidaDocs] Background Workers (BullMQ) Bootstrapped!");

// export removed to satisfy knip
