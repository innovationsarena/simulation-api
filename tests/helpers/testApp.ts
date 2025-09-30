import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import formbody from "@fastify/formbody";

import {
  agentRouter,
  simulationRouter,
  interactionRouter,
} from "../../src/routes";
import { environmentRouter } from "../../src/routes/environment.route";

export async function buildTestApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: false, // Disable logging for tests
  });

  await app.register(formbody);
  await app.register(cors);
  await app.register(helmet);

  // Register routes
  await app.register(simulationRouter);
  await app.register(interactionRouter);
  await app.register(environmentRouter);
  await app.register(agentRouter);

  return app;
}

export function getAuthHeaders() {
  return {
    authorization: `Bearer ${process.env.API_KEY}`,
  };
}