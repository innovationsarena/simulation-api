import { QdrantClient } from "@qdrant/js-client-rest";

// Initialize Qdrant client
export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
  port: 443,
  apiKey: process.env.QDRANT_API_KEY,
  timeout: 30000, // 30 seconds timeout
});

export * from "./uploader";
