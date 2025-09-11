import { Queue, Worker } from "bullmq";

// QUEUE
const QUEUE_NAME = "messageQueue";
export const messageQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(QUEUE_NAME, async (job) => {}, {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
  },
  concurrency: 50,
});
