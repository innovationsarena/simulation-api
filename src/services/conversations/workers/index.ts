import { Queue, Worker } from "bullmq";

// QUEUE
const QUEUE_NAME = "conversationQueue";
export const conversationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    // Get conversation
    // find out whos turn it is
    // Parse messages
  },
  { connection: { port: 6379, host: "127.0.0.1" }, concurrency: 50 }
);
