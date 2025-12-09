import { Simulation } from "@core";
import { getEnvironment } from "../../environments";

export const parseEnviroment = async (
  simulation: Simulation
): Promise<string> => {
  let result = `## Simulation Context\n The simulation takes place in the following context:\n\n`;
  if (simulation.environmentId) {
    const environment = await getEnvironment(simulation.environmentId);

    if (environment.description) {
      result += `${environment.description}\n\n`;
    }

    if (environment.objectives) {
      result += `${environment.objectives.map(
        (o) => `### Objectives\n- ${o}\n`
      )}\n`;
    }

    if (environment.constraints) {
      result += `${environment.constraints.map(
        (o) => `### Constraints\n- ${o}\n`
      )}\n`;
    }

    if (environment.values) {
      result += `${environment.values.map((o) => `### Values\n- ${o}\n`)}\n`;
    }
  }

  simulation.input.type === "topic"
    ? (result += `${simulation.input.description}`)
    : "no context provided.";

  return result + "\n\n";
};
