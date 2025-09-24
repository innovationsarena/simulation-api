import VoltAgent, { Agent } from "@voltagent/core";
import { Interaction } from "../../../core";
import { openai } from "@ai-sdk/openai";
import { getAgentById, parsePrompt } from "../../agents";
import { getSimulation } from "../../simulations";

export const handleConversationStart = async (interaction: Interaction) => {
  try {
    const agents = [];
    const simulation = await getSimulation(interaction.simulationId);

    for await (const participant of interaction.participants) {
      const agent = await getAgentById(participant);
      const subAgentInstructions = await parsePrompt(agent, simulation);

      agents.push(
        new Agent({
          name: agent.name,
          id: agent.id,
          purpose: "A participator in a conversation.",
          instructions: subAgentInstructions,
          model: openai(agent.llmSettings.model),
          hooks: {
            async onEnd(props) {
              console.log("----------->>>>");
              console.log(
                (
                  props.output?.providerResponse as unknown as {
                    messages: any[];
                  }
                ).messages[0].content
              );
              console.log("----------->>>>");
            },
          },
        })
      );
    }

    const supervisorAgentInstructions = `You manage a conversation between ${agents
      .map((a) => `${a.name} (agentId: ${a.id})`)
      .join(", ")}.`;

    const supervisorAgent = new Agent({
      name: "Supervisor Agent",
      instructions: supervisorAgentInstructions,
      model: openai("gpt-5-mini"),
      subAgents: [...agents],
      maxSteps: 10,
      hooks: {
        async onEnd(props) {
          console.log("Interaction ended");
          console.log(JSON.stringify(props.output));
        },
      },
    });

    // Run
    const results = await supervisorAgent.generateText(
      `Start a conversation based on following topic: ${simulation.topic}. In swedish.`
    );

    console.log(results);
  } catch (error: any) {
    console.error(error);
  }
};
