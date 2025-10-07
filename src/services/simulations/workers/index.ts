import { Queue, Worker } from "bullmq";
import { startSimulation, stopSimulation } from "../operations";

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
    if (job.name === "simulation.stop") {
      return await stopSimulation(job.data);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
    concurrency: 50,
  }
);
