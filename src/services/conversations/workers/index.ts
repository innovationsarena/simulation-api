import { Queue, Worker } from "bullmq";
import { conversate, endConversation, startConversation } from "../operations";

// QUEUE
const QUEUE_NAME = "conversationQueue";
export const conversationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log("JOBOBOBOBO ---> ", job.name);

    if (job.name == "conversation.start") {
      console.log(
        `Job id ${job.data.conversation.id} added to START in ${QUEUE_NAME}.`
      );

      const { simulation, conversation, sender } = job.data;

      await startConversation(simulation, conversation, sender);
      return;
    }

    if (job.name == "conversation.converse") {
      const { conversationId } = job.data;
      console.log(
        `Job id ${conversationId} added to CONVERSE in ${QUEUE_NAME}.`
      );

      await conversate(conversationId);
      return;
    }

    if (job.name == "conversation.end") {
      const { conversationId } = job.data;
      console.log(`Job id ${conversationId} added to END in ${QUEUE_NAME}.`);

      await endConversation(conversationId);
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
