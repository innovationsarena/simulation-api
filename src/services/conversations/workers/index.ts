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
      console.log(
        `Job id ${job.data.conversation.id} added to START in ${QUEUE_NAME}.`
      );

      const { simulation, conversation, sender } = job.data;

      await startConversation(simulation, conversation, sender);

      await job.isCompleted();
    }

    if (job.name === "conversation.converse") {
      console.log(
        `Job id ${job.data.conversation.id} added to CONVERSE in ${QUEUE_NAME}.`
      );
      const { conversationId } = job.data;
      await conversate(conversationId);
      await job.isCompleted();
    }

    if (job.name === "conversation.end") {
      console.log(
        `Job id ${job.data.conversation.id} added to END in ${QUEUE_NAME}.`
      );

      await endConversation(job.data.conversationId);
      await job.isCompleted();
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
