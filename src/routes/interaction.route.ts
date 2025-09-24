import {
  createInteractionController,
  getInteractionController,
  startInteractionController,
} from "../controllers";
import { FastifyInstance } from "fastify";
import { interactionInputSchema, validateKey } from "../core";
import { startInteraction } from "../services";

export const interactionRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/interactions",
    {
      schema: interactionInputSchema,
      preValidation: [validateKey],
    },
    createInteractionController
  );

  fastify.get(
    "/interactions/:interactionId",
    {
      schema: {},
      preValidation: [validateKey],
    },
    getInteractionController
  );

  fastify.patch(
    "/interactions/:interactionId/start",
    {
      schema: {},
      preValidation: [validateKey],
    },
    startInteractionController
  );
};
