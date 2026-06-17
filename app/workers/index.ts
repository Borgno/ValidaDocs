import { conciliacaoWorker } from "./conciliacaoWorker.server";
import { comprovanteFatWorker } from "./comprovanteFatWorker.server";

conciliacaoWorker.on('completed', job => console.log(`[BullMQ] 🟢 [Conciliação] Job ${job.id} concluído!`));
conciliacaoWorker.on('failed', (job, err) => console.log(`[BullMQ] 🔴 [Conciliação] Job ${job?.id} falhou: ${err.message}`));
conciliacaoWorker.on('error', err => console.error(`[BullMQ] 🚨 Erro no Worker de Conciliação:`, err));

comprovanteFatWorker.on('completed', job => console.log(`[BullMQ] 🟢 [ComprovanteFAT] Job ${job.id} concluído!`));
comprovanteFatWorker.on('failed', (job, err) => console.log(`[BullMQ] 🔴 [ComprovanteFAT] Job ${job?.id} falhou: ${err.message}`));
comprovanteFatWorker.on('error', err => console.error(`[BullMQ] 🚨 Erro no Worker de ComprovanteFAT:`, err));

console.log("🚀 [ValidaDocs] Background Workers (BullMQ) Bootstrapped! [Conciliação + ComprovanteFAT]");

export { conciliacaoWorker, comprovanteFatWorker };
