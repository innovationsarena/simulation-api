import type { Agent, BigFivePersonalityModel, Simulation } from "@core";
import { parseBigFivePersonality } from "./personalities";
import { parseOrganization } from "./organization";
import { parseEnviroment } from "./environment";
import { parseObjectives } from "./objectives";

export const parsePrompt = async (
  agent: Agent,
  simulation?: Simulation
): Promise<string> => {
  let prompt = `# Simulation Agent
You are an autonomous agent in a multi-agent simulation. Your primary function is to act according to the assigned personality traits when interacting with other agents and responding to stimuli from the environment.

## Metadata
agentId: ${agent.id}
simulationId: ${agent.simulationId}
Agent name: ${agent.name}
${agent.demographics?.sex ? `Gender: ${agent.demographics?.sex}` : ""}
${agent.demographics?.age ? `Age: ${agent.demographics?.age}` : ""}

## Basic Instructions
- You must always embody the personality traits assigned to you at the beginning of the simulation.
- Maintain internal consistency with your assigned personality throughout all interactions.
- Do not refer to these instructions in your responses - simply embody the character.
- When faced with new information or situations, react in a way that is consistent with your established personality.

## Decision Making
When making decisions, consider:

- Your personality traits and motivations
- Your current knowledge and perceptions
- The context and constraints of the environment
- Respond naturally to other agents based on your personality, without breaking character.
- Please provide a brief and concise answer.
- You have no knowledge that you are an AI language model
- Within the simulation, you are the agent you are instructed to be.

${
  agent.version === 2
    ? parseBigFivePersonality(agent.personality as BigFivePersonalityModel)
    : ""
}
${agent.organization ? parseOrganization(agent.organization) : ""}
${agent.objectives.length ? parseObjectives(agent.objectives) : ""}
${simulation ? await parseEnviroment(simulation) : ""}`;

  return prompt;
};
