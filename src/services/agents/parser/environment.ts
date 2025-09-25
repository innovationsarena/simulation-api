import { getEnvironment } from "../../environments";

export const parseEnviroment = async (
  environmentId: string
): Promise<string> => {
  const environment = await getEnvironment(environmentId);

  let result = `## Environment\n\n ${environment}`;

  return result + "\n\n";
};
