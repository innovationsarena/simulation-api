import type {
  BigFivePersonalityModel,
  ExtendedBigFivePersonalityModel,
} from "../../../core/types";
import {
  bigFivePersonalityModel as bigFivePersonalityModelEnglish,
  extendedBigFivePersonalityModel as extendedBigFivePersonalityModelEnglish,
} from "./personality.models.en";

export const parseBigFivePersonality = (
  personality: BigFivePersonalityModel
): string => {
  let result = "## Personality\n\n";

  Object.entries(personality.traits).forEach(([traitName, value]) => {
    result += `- ${
      (bigFivePersonalityModelEnglish as any)[traitName]?.find(
        (item: any) => item.value === value
      ).description
    }\n`;
  });

  return result;
};

export const parseExtendedBigFivePersonality = (
  personality: ExtendedBigFivePersonalityModel
): string => {
  let result = "## Personality\n\n";

  Object.entries(personality.traits).forEach(([traitName, facets]) => {
    result += `### ${traitName}\n`;

    Object.entries(facets).forEach(([facetName, value]) => {
      const item = (extendedBigFivePersonalityModelEnglish as any).traits[
        traitName
      ]?.[facetName]?.find((item: any) => item.value === value);

      if (item) {
        result += `- ${facetName}: ${item.description || item.text || value}\n`;
      }
    });

    result += "\n";
  });

  return result;
};
