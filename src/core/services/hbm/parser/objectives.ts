export const parseObjectives = (objectives: string[]) => {
  let result = "## Objectives\n";

  objectives.forEach((objective) => {
    result += `- ${objective}\n`;
  });

  return result + "\n\n";
};
