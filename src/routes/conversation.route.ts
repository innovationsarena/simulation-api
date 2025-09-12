import {
  createConversationController,
  getConversationController,
} from "../controllers/conversation.controller";
import { FastifyInstance } from "fastify";
import { validateKey } from "../core";
import z from "zod";

const createConversationSchema = z.strictObject({
  senderId: z.string(),
  recieverId: z.string(),
  simulationId: z.string(),
});

export const conversationRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/conversations",
    {
      schema: createConversationSchema,
      preValidation: [validateKey],
    },
    createConversationController
  );

  fastify.get(
    "/conversations/:conversation",
    {
      schema: {
        description: "Get a single conversation.",
        tags: ["conversations"],
      },
      preValidation: [validateKey],
    },
    getConversationController
  );
};
