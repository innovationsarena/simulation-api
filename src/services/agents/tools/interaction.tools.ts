import z from "zod";
import { Tool } from "ai";
import { getSimulation } from "../../simulations";
import { getAgentById, getIdleAgent } from "../operations";

export const InteractTool: Tool<any, string> = {
  description: "Start a new interaction.",
  parameters: z.object({
    senderId: z.string(),
    simulationId: z.string(),
  }),
  execute: async (args: { senderId: string; simulationId: string }) => {
    console.log("Tool: Starting conversation triggered.");

    const sender = await getAgentById(args.senderId);
    const receiver = await getIdleAgent(args.simulationId, args.senderId);
    const simulation = await getSimulation(args.simulationId);

    return "";
  },
};
