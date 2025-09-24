import {
  createInteractionController,
  getInteractionController,
} from "../controllers";
import { FastifyInstance } from "fastify";
import { interactionInputSchema, validateKey } from "../core";
import z from "zod";

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
};
