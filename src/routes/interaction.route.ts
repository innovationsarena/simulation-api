import {
  createInteractionController,
  getInteractionController,
  startInteractionController,
} from "../controllers";
import { FastifyInstance } from "fastify";
import { InteractionInputSchema } from "../core";
import { validateKey } from "../middlewares";

export const interactionRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/interactions",
    {
      schema: InteractionInputSchema,
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
