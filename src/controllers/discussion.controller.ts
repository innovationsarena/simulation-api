import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  Conversation,
  Discussion,
  getAgent,
  getDiscussion,
  getSimulation,
  handleControllerError,
  id,
  listAgents,
  Message,
  parseMessages,
  parsePrompt,
  supabase,
} from "../core";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const createDiscussionController = async (
  request: FastifyRequest<{
    Body: { simulationId: string; minRounds?: number };
  }>,
  reply: FastifyReply
) => {
  try {
    const { simulationId, minRounds = 3 } = request.body;

    const { topic } = await getSimulation(simulationId, reply);
    const agents: Agent[] = await listAgents(simulationId, reply);

    // CREATE DISCUSSION
    const discussionId = id(12);

    const discussion: Omit<Discussion, "messages"> = {
      id: discussionId,
      simulationId,
      topic,
      active: true,
      minRounds,
      participants: [...agents.map((agent) => agent.id)],
    };

    const { data: c, error: discussionError } = await supabase
      .from(process.env.DISCUSSIONS_TABLE_NAME as string)
      .insert(discussion);

    if (discussionError)
      reply
        .status(discussionError.code as unknown as number)
        .send(discussionError.message);
  } catch (error) {
    handleControllerError(error, reply);
  }
};

export const getDiscussionController = async (
  request: FastifyRequest<{
    Params: { discussionId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { discussionId } = request.params;

    const conversation = await getDiscussion(discussionId, reply);

    reply.status(200).send(conversation);
  } catch (error) {
    handleControllerError(error, reply);
  }
};
