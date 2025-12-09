export const parseObjectives = (objectives: string[]) => {
  let result = "## Personal contextual information\n";

  objectives.forEach((objective) => {
    result += `- ${objective}\n`;
  });

  return result + "\n\n";
};
