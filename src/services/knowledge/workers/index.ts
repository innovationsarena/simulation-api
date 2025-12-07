import { Queue, Worker } from "bullmq";
import { concurrency, connection } from "../../../core";
import { parseFile } from "./knowledge.handler";

// QUEUE
export const QUEUE_NAME = "ragQueue";
export const ragQueue = new Queue(QUEUE_NAME, { connection });

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "knowledge.file.parse") {
      await parseFile(job.data);
    }
    if (job.name === "knowledge.file.chunk") {
      console.log("starting chunking file.");
    }
    if (job.name === "knowledge.file.embeddings") {
      console.log("starting creating embeddings of file.");
    }

    if (job.name === "knowledge.file.vector") {
      console.log("Store embedding in vector db.");
    }
  },
  {
    connection,
    concurrency,
  }
);
