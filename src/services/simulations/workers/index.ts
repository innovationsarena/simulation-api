import { Queue, Worker } from "bullmq";
import { startSimulation } from "../operations";

// QUEUE
const QUEUE_NAME = "simulationQueue";
export const simulationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "simulation.start") {
      return await startSimulation(job.data);
    }
  },
  { connection: { port: 6379, host: "127.0.0.1" }, concurrency: 50 }
);
