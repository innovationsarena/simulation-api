import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import { createConversationController, getConversationController } from "../controllers/conversation.controller";

export const conversationRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/conversations",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          additionalProperties: false,
        },
      },
      config: {
        description: "Create a new conversation.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    createConversationController as unknown as RouteHandlerMethod
  );

  fastify.get(
    "/conversations/:conversation",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            conversation: { type: "string" },
          },
          required: ["conversation"],
          additionalProperties: false,
        },
      },
      config: {
        description: "Get a single conversation.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    getConversationController as unknown as RouteHandlerMethod
  );
};