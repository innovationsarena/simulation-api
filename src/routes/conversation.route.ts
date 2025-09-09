import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  createConversationController,
  getConversationController,
} from "../controllers/conversation.controller";

export const conversationRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/conversations",
    {
      preValidation: [],
      preHandler: [validateKey],
    },
    createConversationController as unknown as RouteHandlerMethod
  );

  fastify.get(
    "/conversations/:conversation",
    {
      schema: {
        description: "Get a single conversation.",
        tags: ["conversations"],
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    getConversationController as unknown as RouteHandlerMethod
  );
};
