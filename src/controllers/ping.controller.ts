import { FastifyReply, FastifyRequest } from "fastify";

export const pingController = async (
  request: FastifyRequest<{
    Body: { message: string };
  }>,
  reply: FastifyReply<{
    Body: { message: string };
  }>
) => {
  try {
    await reply.status(200).send({ message: "Pong!" });
  } catch (error: any) {
    reply.log.error(error.message);
    throw new Error(error.message);
  }
};
