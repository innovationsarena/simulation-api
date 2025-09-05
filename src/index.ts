import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import formbody from "@fastify/formbody";

import {
  simulationRouter,
  agentRouter,
  docsRouter,
  conversationRouter,
  discussionRouter,
  evaluationsRouter,
} from "./routes";

import "./consumers";

const PORT = Number(process.env.PORT) || 3000;

const server = fastify({
  logger: {
    level: "info",
  },
});

server.register(formbody);
server.register(cors);
server.register(helmet);

server.setErrorHandler((error, _request, reply) => {
  server.log.error(error);
  if (error.message) {
    reply.status(400).send({ error: error.message });
  } else {
    reply.status(500).send({ error: "Oh poo, something went wrong!" });
  }
});

// Routes
server.register(docsRouter);
server.register(simulationRouter);
server.register(conversationRouter);
server.register(discussionRouter);
server.register(agentRouter);
server.register(evaluationsRouter);

server.listen({
  port: PORT,
  host: "0.0.0.0",
  listenTextResolver: (address) => {
    return `Simulator API server is listening at ${address}`;
  },
});
