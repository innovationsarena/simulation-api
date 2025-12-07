import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import formbody from "@fastify/formbody";
import multipart from "@fastify/multipart";

import {
  docsRouter,
  agentRouter,
  simulationRouter,
  interactionRouter,
  environmentRouter,
  knowledgeRouter,
} from "./routes";

const PORT = Number(process.env.PORT) || 3000;

const server = fastify({
  logger: {
    level: "info",
  },
});

server.register(multipart, {
  limits: {
    fileSize: 30 * 1024 * 1024, // 10MB
  },
});
server.register(formbody);
server.register(cors);
server.register(helmet);

// Routes - docs must be registered first for static assets
server.register(docsRouter);
server.register(simulationRouter);
server.register(interactionRouter);
server.register(environmentRouter);
server.register(knowledgeRouter);
server.register(agentRouter);

server.listen({
  port: PORT,
  host: "0.0.0.0",
  listenTextResolver: (address) => {
    return `Simulator API server is listening at ${address}`;
  },
});
