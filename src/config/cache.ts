import { createClient, RedisClientType } from "redis";

export let redisClient: RedisClientType | null = null;

export const initRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries: number) => Math.min(retries * 50, 2000),
      },
    });

    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    redisClient.on("end", () => console.warn("Redis connection closed."));
    redisClient.on("reconnecting", () =>
      console.log("Reconnecting to Redis...")
    );

    await redisClient.connect();
    console.log("Redis connected successfully");
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis client is not initialized. Call initRedis first.");
  }
  return redisClient;
};
