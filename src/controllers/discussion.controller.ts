import { FastifyReply, FastifyRequest } from "fastify";
import {
  Agent,
  Discussion,
  asyncHandler,
  id,
  Message,
  parseMessages,
} from "../core";

import {
  getAgentByName,
  getDiscussion,
  getSimulation,
  listAgents,
  parsePrompt,
  supabase,
} from "../services";

import { generateText, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import z from "zod";

export const createDiscussionController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: { simulationId: string; minRounds?: number; agents?: Agent[] };
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId, agents, minRounds = 3 } = request.body;
    const { topic } = await getSimulation(simulationId);
    const simAgents = await listAgents(simulationId);

    // If agents are given in body
    let participants: Agent[] =
      agents && agents.length > 1 ? agents : simAgents;

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

    const { data, error: createDiscussionError } = await supabase
      .from(process.env.DISCUSSIONS_TABLE_NAME as string)
      .insert(discussion);

    if (createDiscussionError) throw new Error(createDiscussionError.message);
    const systemPrompt = `You are a moderator in a discussion forum. 
    
    ## Instructions
    - You have via 'askAgent' tool access to the following agents: ${participants
      ?.map((agent) => agent.name)
      .join(", ")}.
      - You ask one at at the time and wait for their reply before moving on to next participant. Make sure every agent get a saying in at least ${minRounds} times.
      
      ## Tools
      
      - 'askAgent' when you want to pass the word to one of the agents.`;
    // Run discussion
    const resp = streamText({
      model: openai("gpt-4o"),
      maxSteps: 10,
      tools: {
        askAgent: tool({
          description: "Agents",
          parameters: z.object({
            agentName: z.string(),
          }),

          execute: async (args) => {
            // Execute agent
            const agent = await getAgentByName(simulationId, args.agentName);

            // Get messages
            const { messages } = await getDiscussion(discussionId);

            const m = messages.length
              ? messages
              : ([
                  {
                    senderId: "moderator",
                    parentId: discussionId,
                    content: `We must discuss: ${topic}.`,
                    simulationId,
                  },
                ] as Message[]);

            const { text, usage } = await generateText({
              model: openai("gpt-4.1-mini"),
              system: await parsePrompt(agent),
              messages: parseMessages(m, agent.id),
            });

            // Save message to db
            const replyMessage: Message = {
              senderId: agent.id,
              parentId: discussionId,
              parentType: "discussion",
              content: text,
              simulationId,
              tokens: usage,
            };
          },
        }),
      },
      system: systemPrompt,
      prompt: `We must discuss: ${topic}. `,
    });

    return resp;
  }
);

export const getDiscussionController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { discussionId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { discussionId } = request.params;

    const conversation = await getDiscussion(discussionId);

    return reply.status(200).send(conversation);
  }
);
