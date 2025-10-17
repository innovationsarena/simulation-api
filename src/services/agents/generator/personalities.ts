import { BigFivePersonalityModel } from "@core/types";
import { personalities } from "../parser/personality.models.en";
import { DataItem, items } from "./bigfivedata";

// Simple
export const getSimplePersonality = (): string => {
  return personalities[Math.floor(Math.random() * personalities.length)];
};

// General
export const getBigFivePersonality = (
  sex: string,
  age: number
): BigFivePersonalityModel => {
  const filteredItems: DataItem[] = items.filter(
    (item: DataItem) => item.sex === sex && item.age === age
  );

  const len = filteredItems.length;

  if (!len)
    throw new Error("No matching (age, sex) data in big five data file.");

  const rand = Math.floor(Math.random() * len);

  const selected = filteredItems[rand];

  return {
    source: "bigfive",
    traits: {
      openness: selected.openness,
      conscientiousness: selected.conscientiousness,
      extraversion: selected.extraversion,
      agreeableness: selected.agreeableness,
      neuroticism: selected.neuroticism,
    },
  } as BigFivePersonalityModel;
};
