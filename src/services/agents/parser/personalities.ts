import type { BigFivePersonalityModel } from "@core";
import { bigFivePersonalityModel as bigFivePersonalityModelEnglish } from "./personality.models.en";

export const parseBigFivePersonality = (
  personality: BigFivePersonalityModel
): string => {
  let result = "## Personality\n";
  Object.entries(personality.traits).forEach(([traitName, value]) => {
    result += `- ${
      (bigFivePersonalityModelEnglish as any)[traitName]?.find(
        (item: any) => item.value === value
      ).description
    }\n`;
  });

  return result;
};
