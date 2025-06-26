import { FastifyReply, FastifyRequest } from "fastify";
import { createHash } from "node:crypto";

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

export const createConversationId = (
  agentAid: string,
  agentBid: string
): string => {
  return createHash("shake256", { outputLength: 8 })
    .update([agentAid, agentBid].sort().join(""))
    .digest("hex");
};

export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const toLocalISO = (date: Date) => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
};

export const id = (len: number = 8) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz";
  let shortUuid = "";
  for (let i = 0; i < len; i++) {
    shortUuid += chars[Math.floor(Math.random() * chars.length)];
  }
  return shortUuid;
};

export const generateSimName = () => {
  const pre = ["Awesome", "Super", "Mega", "Ninja", "Cool", "Sparkly"];
  const post = [
    "alfa",
    "beta",
    "omega",
    "banana",
    "nova",
    "galaxy",
    "space",
    "sparkle",
  ];

  return `${pre[Math.floor(Math.random() * pre.length)]} ${
    post[Math.floor(Math.random() * post.length)]
  }`;
};

export * from "./errorHandler";
