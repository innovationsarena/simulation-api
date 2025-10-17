import { Queue, Worker } from "bullmq";
import { startSimulation, stopSimulation } from "../operations";
import { concurrency, connection } from "@core";

// QUEUE
const QUEUE_NAME = "simulationQueue";
export const simulationQueue = new Queue(QUEUE_NAME, { connection });

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "simulation.start") {
      return await startSimulation(job.data);
    }
    if (job.name === "simulation.stop") {
      return await stopSimulation(job.data);
    }
  },
  {
    connection,
    concurrency,
  }
);
