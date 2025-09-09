import { Message } from "ai";
import { Queue, Worker } from "bullmq";

// QUEUE
const CUEUE_NAME = "conversationQueue";
export const conversationQueue = new Queue(CUEUE_NAME);

// WORKERS
new Worker(CUEUE_NAME, async (job) => {
  // Get conversation
  // find out whos turn it is
  // Parse messages
});
