export const parseObjectives = (objectives: string[]) => {
  if (!Array.isArray(objectives)) return "";

  let result = "## Personal contextual information\n";

  objectives.forEach((objective) => {
    result += `- ${objective}\n`;
  });

  return result + "\n\n";
};
