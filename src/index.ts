import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import formbody from "@fastify/formbody";

import {
  docsRouter,
  agentRouter,
  simulationRouter,
  interactionRouter,
} from "./routes";

const PORT = Number(process.env.PORT) || 3000;

const server = fastify({
  logger: {
    level: "info",
  },
});

server.register(formbody);
server.register(cors);
server.register(helmet);

// Routes
server.register(simulationRouter);
server.register(interactionRouter);
server.register(agentRouter);
server.register(docsRouter);

server.listen({
  port: PORT,
  host: "0.0.0.0",
  listenTextResolver: (address) => {
    return `Simulator API server is listening at ${address}`;
  },
});
