import { Queue, Worker } from "bullmq";

// QUEUE
const QUEUE_NAME = "messageQueue";
export const messageQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "message.create") {
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
    concurrency: 50,
  }
);
