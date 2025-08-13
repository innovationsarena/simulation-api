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
        description: "Create a new conversation.",
        tags: ["conversations"],
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
  fastify.patch(
    "/conversations/:conversation",
    {
      schema: {
        description: "Conversate.",
        tags: ["conversations"],
        body: {
          type: "object",
          properties: {
            senderId: { type: "string" },
          },
          additionalProperties: false,
        },
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
        description: "End conversation.",
        tags: ["conversations"],
        body: {},
      },
      preValidation: [],
      preHandler: [validateKey],
    },
    endConversationController as unknown as RouteHandlerMethod
  );
};
