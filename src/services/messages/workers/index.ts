import { Queue, Worker } from "bullmq";
import { concurrency, connection } from "@core";

// QUEUE
const QUEUE_NAME = "messageQueue";
export const messageQueue = new Queue(QUEUE_NAME, { connection });

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "message.create") {
    }
  },
  {
    connection,
    concurrency,
  }
);
