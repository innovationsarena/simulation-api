import { Agent } from "@voltagent/core";
import { Interaction } from "../../../core";
import { openai } from "@ai-sdk/openai";
import { getAgentById, parsePrompt } from "../../agents";
import { getSimulation } from "../../simulations";

export const handleConversationStart = async (interaction: Interaction) => {
  console.log(interaction);

  try {
    const agents = [];
    const simulation = await getSimulation(interaction.simulationId);

    for await (const participant of interaction.participants) {
      const agent = await getAgentById(participant);
      console.log(agent);
      const instructions = await parsePrompt(agent, simulation);
      console.log(instructions);

      agents.push(
        new Agent({
          name: agent.name,
          purpose: "A participator in a conversation.",
          instructions,
          model: openai(agent.llmSettings.model),
          hooks: {
            onEnd(props) {
              console.log(props);
            },
          },
        })
      );
    }

    const supervisorAgent = new Agent({
      name: "Supervisor Agent",
      instructions: "You manage a conversation between two agents.",
      model: openai("gpt-5-mini"),
      subAgents: [...agents],
    });

    // Run
    const results = await supervisorAgent.generateText(
      `Start a conversation based on following topic: ${simulation.topic}. In swedish.`
    );

    console.log(results);
  } catch (error: any) {
    console.log(
      "E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E E "
    );
    console.error(error);
  }
};
