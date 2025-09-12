import { Queue, Worker } from "bullmq";
import { getConversation, startConversationOperation } from "../operations";
import {
  endConversation,
  findConversationPartner,
  getAgentById,
  parsePrompt,
  startConversation,
} from "../../agents";
import { Message, parseMessages } from "../../../core";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createMessage } from "../../messages";

// QUEUE
const QUEUE_NAME = "conversationQueue";
export const conversationQueue = new Queue(QUEUE_NAME);

// WORKERS
new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === "conversation.start") {
      const { simulation, conversation, sender } = job.data;
      await startConversationOperation(simulation, conversation, sender);
    }

    if (job.name === "conversation.converse") {
      const { conversationId } = job.data;

      const conversation = await getConversation(conversationId);

      const { activeSpeakerId, participants, simulationId, messages } =
        conversation;
      const senderId = participants.find((agent) => agent !== activeSpeakerId);
      const sender = await getAgentById(senderId || "");

      const { text, usage } = await generateText({
        model: openai(sender.llmSettings.model),
        system: await parsePrompt(sender),
        messages: parseMessages(messages, sender.id),
        tools: { findConversationPartner, startConversation, endConversation },
      });

      // Save message to db
      const message: Message = {
        senderId: sender.id,
        parentId: conversationId,
        parentType: "discussion",
        content: text,
        simulationId,
        tokens: usage,
      };

      await createMessage(message);

      await conversationQueue.add("conversation.converse", {
        conversationId: conversation.id,
      });
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
    concurrency: 50,
  }
);
