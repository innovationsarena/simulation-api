import { createHash } from "crypto";

export const createConversationId = (
  agentAid: string,
  agentBid: string
): string => {
  return createHash("shake256", { outputLength: 8 })
    .update([agentAid, agentBid].sort().join(""))
    .digest("hex");
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
