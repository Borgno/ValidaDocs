import Redis from "ioredis";

// maxRetriesPerRequest: null é exigência do BullMQ
export const redisConnection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
