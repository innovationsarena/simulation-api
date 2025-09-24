import { Queue, Worker } from "bullmq";

// QUEUE
export const QUEUE_NAME = "interactionsQueue";
export const interactionsQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "interaction.start") {
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
