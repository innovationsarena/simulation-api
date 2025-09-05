import { Queue } from "bullmq";
import { Agent } from "../../core";

export const queue = new Queue("evaluationsQueue");

export const runBigfiveEvaluation = async (
  queue: Queue,
  agent: Agent
): Promise<void> => {
  await queue.add("agent.evaluation.", agent, {
    removeOnComplete: true,
    removeOnFail: true,
  });
};
