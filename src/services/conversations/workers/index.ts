import { Queue, Worker } from "bullmq";
import { conversate, endConversation, startConversation } from "../operations";

// QUEUE
const QUEUE_NAME = "conversationQueue";
export const conversationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "conversation.start") {
      const { simulation, conversation, sender } = job.data;
      await startConversation(simulation, conversation, sender);
      return;
    }

    if (job.name === "conversation.converse") {
      const { conversationId } = job.data;
      await conversate(conversationId);
      return;
    }

    if (job.name === "conversation.end") {
      await endConversation(job.data.conversationId);
      return;
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
