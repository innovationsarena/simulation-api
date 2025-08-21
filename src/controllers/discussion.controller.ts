import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  Conversation,
  Discussion,
  getAgentByName,
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
import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";

export const createDiscussionController = async (
  request: FastifyRequest<{
    Body: { simulationId: string; minRounds?: number; agents?: Agent[] };
  }>,
  reply: FastifyReply
) => {
  try {
    const { simulationId, agents, minRounds = 3 } = request.body;
    const { topic } = await getSimulation(simulationId, reply);

    // If agents are given in body
    let participants: Agent[] =
      agents && agents.length > 1
        ? agents
        : await listAgents(simulationId, reply);

    // CREATE DISCUSSION
    const discussionId = id(12);

    const discussion: Omit<Discussion, "messages"> = {
      id: discussionId,
      simulationId,
      topic,
      active: true,
      minRounds,
      participants: participants.map((agent) => agent.id),
    };

    const { data: c, error: createDiscussionError } = await supabase
      .from(process.env.DISCUSSIONS_TABLE_NAME as string)
      .insert(discussion);

    if (createDiscussionError)
      reply
        .status(createDiscussionError.code as unknown as number)
        .send(createDiscussionError.message);

    // Run discussion
    const resp = await generateText({
      model: openai("gpt-4o"),
      tools: {
        askAgent: tool({
          description: "Agents",
          parameters: z.object({
            agentName: z.string(),
            simulationId: z.string(),
            messageHistory: z.array(z.any()),
          }),

          execute: async (args) => {
            // Execute agent

            const agent = await getAgentByName(args.agentName, reply);

            // Get messages

            generateText({
              model: openai("gpt-4.1-mini"),
              system: await parsePrompt(agent),
            });

            // Save message to db
          },
        }),
      },
      system: `You are a moderator in a discussion forum. You have via 'askAgent' tool access to the following persons: <AGENT_NAMES>. Make sure every one get a saying in at least MIN_ROUNDS.`,
    });
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
