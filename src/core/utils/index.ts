import { FastifyReply, FastifyRequest } from "fastify";
import { Message } from "../types";
import { CoreMessage } from "ai";

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

export const toLocalISO = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
};

export const parseMessages = (
  messages: Message[],
  senderid: string
): CoreMessage[] => {
  return messages.map((message) => {
    return {
      role: message.senderId === senderid ? "user" : "assistant",
      content: message.content,
    };
  });
};

export * from "./errorHandler";
export * from "./generators";
