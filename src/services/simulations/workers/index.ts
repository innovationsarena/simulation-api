import { Queue, Worker } from "bullmq";

// QUEUE
const QUEUE_NAME = "simulationQueue";
export const simulationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(QUEUE_NAME, async (job) => {
  // Get conversation
  // find out whos turn it is
  // Parse messages
});
