import { Queue, Worker } from "bullmq";
import { Interaction } from "../../../core";
import { handleConversationStart } from "./discussion.handler";
import { concurrency, connection } from "../../../core";

// QUEUE
export const QUEUE_NAME = "interactionsQueue";
export const interactionsQueue = new Queue(QUEUE_NAME, { connection });

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "interaction.conversation.start") {
      console.log("starting Interaction flow of type 'conversation'.");
      await handleConversationStart(job.data as Interaction);
      return;
    }

    if (job.name === "interaction.discussion.start") {
      console.log("starting Interaction flow of type 'discussion'.");
    }
    if (job.name === "interaction.survey.start") {
      console.log("starting Interaction flow of type 'survey'.");
    }
  },
  {
    connection,
    concurrency,
  }
);
