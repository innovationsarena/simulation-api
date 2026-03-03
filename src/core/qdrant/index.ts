import { QdrantClient } from "@qdrant/js-client-rest";

// or connect to Qdrant Cloud
export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  port: 443,
  https: true,
  checkCompatibility: false,
});
