import { handleBigfiveEvaluation } from "./bigfive.worker";
import { concurrency, connection } from "@core";
import { Queue, Worker } from "bullmq";

// QUEUE
const QUEUE_NAME = "evaluationsQueue";
export const evaluationsQueue = new Queue(QUEUE_NAME, { connection });

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "evaluation.bigfive") {
      return await handleBigfiveEvaluation(job);
    }
  },
  {
    connection,
    concurrency,
  }
);
