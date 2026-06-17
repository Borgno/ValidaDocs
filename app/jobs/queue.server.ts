import { Queue } from "bullmq";
import { redisConnection } from "../services/redis.server";

export const documentQueue = new Queue("DocumentQueue", {
  connection: redisConnection as any,
});

export async function enqueueJob(name: string, data: any) {
  await documentQueue.add(name, data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  });
}
