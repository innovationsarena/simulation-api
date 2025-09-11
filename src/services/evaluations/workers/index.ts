import { Queue, Worker } from "bullmq";
import { handleBigfiveEvaluation } from "./bigfive.worker";

// QUEUE
export const QUEUE_NAME = "evaluationsQueue";
export const evaluationsQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "evaluation.bigfive") {
      return await handleBigfiveEvaluation(job);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
    concurrency: 50,
  }
);
