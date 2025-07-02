import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { validateKey } from "../core";
import {
  createConversationController,
  getConversationController,
  makeConversationController,
  endConversationController,
} from "../controllers/conversation.controller";

export const conversationRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/conversations",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            senderId: { type: "string" },
            recieverId: { type: "string" },
            simulationId: { type: "string" },
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
      config: {
        description: "Get a single conversation.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    getConversationController as unknown as RouteHandlerMethod
  );
  fastify.patch(
    "/conversations/:conversation",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            senderId: { type: "string" },
          },
          additionalProperties: false,
        },
      },
      config: {
        description: "Conversate.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    makeConversationController as unknown as RouteHandlerMethod
  );
  fastify.delete(
    "/conversations/:conversation",
    {
      schema: {
        body: {},
      },
      config: {
        description: "End conversation.",
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    endConversationController as unknown as RouteHandlerMethod
  );
};
