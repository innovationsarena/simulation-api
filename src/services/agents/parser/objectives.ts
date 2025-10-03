export const parseObjectives = (objectives: string[]) => {
  let result = "## Contextual information\n";

  objectives.forEach((objective) => {
    result += `- ${objective}\n`;
  });

  return result + "\n\n";
};
