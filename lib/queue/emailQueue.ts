import { Queue } from "bullmq";
import { getRedisConnection } from "../redis";

const connection = getRedisConnection();

export const emailRetryQueue: Queue | null = connection
  ? new Queue("email-retry-queue", {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    })
  : null;