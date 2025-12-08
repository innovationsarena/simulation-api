import { Queue, Worker } from "bullmq";
import { concurrency, connection } from "../../../core";
import {
  chunkFile,
  convertFile,
  createEmbeddings,
  storeEmbeddings,
} from "./knowledge.handler";

// QUEUE
export const QUEUE_NAME = "ragQueue";
export const ragQueue = new Queue(QUEUE_NAME, { connection });

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "knowledge.file.convert") {
      await convertFile(job.data);
    }
    if (job.name === "knowledge.file.chunk") {
      await chunkFile(job.data);
    }
    if (job.name === "knowledge.file.embeddings") {
      await createEmbeddings(job.data);
    }

    if (job.name === "knowledge.file.vector") {
      await storeEmbeddings(job.data);
    }
  },
  {
    connection,
    concurrency,
  }
);
