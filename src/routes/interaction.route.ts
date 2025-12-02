import { InteractionInputSchema } from "@core";
import { validateKey } from "@middlewares";
import { FastifyInstance } from "fastify";
import {
  createInteractionController,
  getInteractionController,
  getInteractionMessagesController,
  startInteractionController,
} from "@controllers";

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

  fastify.get(
    "/interactions/:interactionId/messages",
    {
      schema: {},
      preValidation: [validateKey],
    },
    getInteractionMessagesController
  );

  fastify.get(
    "/interactions/:interactionId/summary",
    {
      schema: {},
      preValidation: [validateKey],
    },
    getInteractionMessagesController
  );
};
