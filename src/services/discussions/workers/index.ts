import { Queue, Worker } from "bullmq";

// QUEUE
const QUEUE_NAME = "discussionQueue";
export const discussionQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    // Get conversation
    // find out whos turn it is
    // Parse messages
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
    concurrency: 50,
  }
);
