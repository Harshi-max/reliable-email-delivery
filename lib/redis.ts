import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL);
  }

  return redis;
}

export function getRedisConnection() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  return {
    url: process.env.REDIS_URL,
  };
}