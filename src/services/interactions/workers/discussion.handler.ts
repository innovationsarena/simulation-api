import { Agent } from "@voltagent/core";
import { Interaction, Message } from "../../../core";
import { openai } from "@ai-sdk/openai";
import { getAgentById, parsePrompt } from "../../agents";
import { getSimulation } from "../../simulations";
import { createMessage } from "../../messages";
import { endInteraction } from "../operations";

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
          purpose: "A participant in a conversation.",
          instructions: subAgentInstructions,
          model: openai("gpt-4-turbo"),
          context: {
            simulation,
            interaction,
          },
          hooks: {
            onStart: async (props) => {
              console.log(`SubAgent (${props.agent.id}) started.`);
            },
            onEnd: async (props) => {
              const providerResponse: any = props.output?.providerResponse;
              const content = await extractMessage(providerResponse);
              if (content) {
                const interaction = props.context.context.get(
                  "interaction"
                ) as Interaction;

                await createNewMessage(
                  interaction,
                  content,
                  props.agent.id,
                  props.output?.usage
                );
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
      model: openai("gpt-5-mini"),
      subAgents: [...agents],
      maxSteps: agents.length * (interaction.turns || 3),
      hooks: {
        onStart: () => {
          console.log("Interaction started.");
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
      `Start a conversation based on following topic: ${simulation.topic}. In swedish.`
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

async function createNewMessage(
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
