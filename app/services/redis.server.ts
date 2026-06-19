import Redis from "ioredis";

let redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
if (process.env.RUNNING_IN_DOCKER === "true" && redisUrl) {
  redisUrl = redisUrl.replace("://localhost:", "://redis:").replace("://127.0.0.1:", "://redis:");
}

// maxRetriesPerRequest: null é exigência do BullMQ
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});
