export const tools = (tools: string[]) => {
  let result = "## Verktyg\n";

  tools.forEach((tool) => {
    result += `- ${tool}\n`;
  });

  return result + "\n\n";
};
