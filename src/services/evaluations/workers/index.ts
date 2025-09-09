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
  { connection: { port: 6379, host: "127.0.0.1" }, concurrency: 50 }
);
