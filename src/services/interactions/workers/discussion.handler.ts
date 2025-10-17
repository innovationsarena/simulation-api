import { Interaction, Message, Simulation } from "../../../core";
import { getAgentById, parsePrompt } from "../../agents";
import { getSimulation } from "../../simulations";
import { createMessage } from "../../messages";
import { endInteraction } from "../operations";
import { Agent } from "@voltagent/core";
import { openai } from "@ai-sdk/openai";

export const handleDiscussionStart = async (interaction: Interaction) => {
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
          purpose: "A participant in a conversation.",
          instructions: subAgentInstructions,
          model: openai(agent.llmSettings.model), // gpt-4-turbo
          context: {
            simulation,
            interaction,
          },
          hooks: {
            onStart: async (props) => {
              console.log(
                `SubAgent '${props.agent.name}' (${props.agent.id}) started.`
              );
            },
            onEnd: async (props) => {
              const providerResponse: any = props.output?.providerResponse;
              const content = await extractMessage(providerResponse);
              if (content) {
                const interaction = props.context.context.get(
                  "interaction"
                ) as Interaction;

                await constructMessage(
                  interaction,
                  content,
                  props.agent.id,
                  props.output?.usage
                );

                console.log(`SubAgent (${props.agent.name}) ended.`);
              }
            },
          },
        })
      );
    }

    const supervisorAgentInstructions = `You manage a conversation between ${agents
      .map((a) => `${a.name} (agentId: ${a.id})`)
      .join(
        ", "
      )}. Your assigment is to stere the conversation one Agent and one answer at the time. Make sure the agents are discussin the given topic thoroughly.`;

    const supervisorAgent = new Agent({
      name: "Supervisor Agent",
      instructions: supervisorAgentInstructions,
      model: openai((process.env.SUPERVISOR_AGENT_MODEL as string) || "gpt-5"),
      subAgents: [...agents],
      maxSteps: agents.length * (interaction.turns || 3),
      hooks: {
        onStart: () => {
          console.log(`Interaction started with ${interaction.turns || 3}.`);
        },
        onEnd: async (props) => {
          console.log("Interaction ended.");
          // Summarize
          const interaction = props.context.context.get(
            "interaction"
          ) as Interaction;

          await endInteraction(interaction);
        },
      },
      supervisorConfig: {
        customGuidelines: [
          `Each Agent must give at least ${interaction.turns || 3} answers.`,
        ],
      },
    });

    // Run
    const results = await supervisorAgent.generateText(
      `Start a discussion based on following instructions: \n ${parseSimulationInput(
        simulation
      )}. In swedish.`
    );

    return;
  } catch (error: any) {
    console.error(error);
  }
};

async function extractMessage(resp: any): Promise<string> {
  const msg = resp.messages[0];
  const content: string = await msg.content.find(
    (c: any) => c.type === "text" && !c.text.includes("converseTool")
  ).text;

  return content;
}

async function constructMessage(
  interaction: Interaction,
  text: string,
  agentId: string,
  tokens: any
) {
  const message: Message = {
    simulationId: interaction.simulationId,
    interactionId: interaction.id,
    interactionType: interaction.type,
    content: text,
    senderId: agentId,
    tokens: {
      inputTokens: tokens.promptTokens || 0,
      outputTokens: tokens.completionTokens || 0,
      totalTokens: tokens.totalTokens || 0,
    },
  };

  await createMessage(message);
}

const parseSimulationInput = (simulation: Simulation) => {
  switch (simulation.input.type) {
    case "topic":
      return `${simulation.input.description}`;
    case "challange":
      return `${simulation.input.description}`;
    case "issue":
      return `${simulation.input.description}`;
  }
};
