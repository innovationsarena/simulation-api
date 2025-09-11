import { Queue, Worker } from "bullmq";
import { startConversationOperation } from "../operations";

// QUEUE
const QUEUE_NAME = "conversationQueue";
export const conversationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "conversation.start") {
      const { simulation, conversation, sender } = job.data;
      await startConversationOperation(simulation, conversation, sender);
    }

    if (job.name === "conversation.converse") {
      console.log(job);
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
