import { getEnvironment } from "../../environments";

export const parseEnviroment = async (
  environmentId: string
): Promise<string> => {
  const environment = await getEnvironment(environmentId);

  let result = `## Environment\n The simulation takes place in the following context:\n\n`;

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

  return result + "\n\n";
};
