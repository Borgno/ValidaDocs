import { documentWorker } from "./documentWorker.server";

documentWorker.on('completed', job => console.log(`[BullMQ] 🟢 [${job.name}] Job ${job.id} concluído!`));
documentWorker.on('failed', (job, err) => console.log(`[BullMQ] 🔴 [${job?.name}] Job ${job?.id} falhou: ${err.message}`));
documentWorker.on('error', err => console.error(`[BullMQ] 🚨 Erro no Worker Central:`, err));

console.log("🚀 [ValidaDocs] Background Worker Central (BullMQ) Bootstrapped!");

// export removed to satisfy knip
