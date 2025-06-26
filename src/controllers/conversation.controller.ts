import { FastifyReply, FastifyRequest } from "fastify";

export const createConversationController = async (
  request: FastifyRequest<{
    Body: { title?: string; description?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { title, description } = request.body;
    await reply.status(201).send({ 
      id: Date.now().toString(),
      title: title || "New Conversation",
      description,
      created_at: new Date().toISOString(),
      messages: []
    });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};

export const getConversationController = async (
  request: FastifyRequest<{
    Params: { conversation: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversation } = request.params;
    await reply.status(200).send({ 
      id: conversation,
      title: "Sample Conversation",
      description: "A sample conversation",
      created_at: new Date().toISOString(),
      messages: []
    });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};