import { Queue, Worker } from "bullmq";
import { Interaction } from "../../../core";
import { handleConversationStart } from "./discussion.handler";

// QUEUE
export const QUEUE_NAME = "interactionsQueue";
export const interactionsQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "interaction.conversation.start") {
      console.log("starting conversation.");
      await handleConversationStart(job.data as Interaction);
      return;
    }

    if (job.name === "interaction.discussion.start") {
      console.log("starting discussion.");
    }
    if (job.name === "interaction.survey.start") {
      console.log("starting survey.");
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
