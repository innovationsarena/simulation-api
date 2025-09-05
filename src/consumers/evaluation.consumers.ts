import { eventBus, getAgentById } from "../services";

eventBus.on("agent.evalute.bigfive", async ({ agentId, sample }) => {
  const agent = getAgentById(agentId);
});
