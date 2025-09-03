import { FastifyReply, FastifyRequest } from "fastify";

export const validateKey = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.headers["authorization"]) {
    throw new Error("API key not found.");
  }

  const API_KEY = request.headers["authorization"].split(" ")[1];

  if (!API_KEY) {
    throw new Error("API key not found.");
  }

  const valid = process.env.API_KEY === API_KEY;

  if (valid) {
    return;
  } else throw new Error("API key not valid.");
};
