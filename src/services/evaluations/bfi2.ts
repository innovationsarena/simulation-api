import { supabase } from "../../core";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { getAgentById, parsePrompt } from "../agents";
import z from "zod";

export const evaluateBigfive = async (agentId: string) => {
  const agent = await getAgentById(agentId);

  const prompt = `
  Prompt:

You are to complete the Big Five Inventory-2 (BFI-2) personality test, which consists of 60 statements. For each statement, select your response based on how well it describes you, using the following scale:

1 = Disagree strongly
2 = Disagree a little
3 = Neither agree nor disagree
4 = Agree a little
5 = Agree strongly

Return your answers as a single array of 60 strings (each value between 1 and 5), corresponding to your responses for each statement in order.

Example output:
["3", "4", "2", "5", "1", ..., "4"] (with 60 values in total)

Do not include any explanations or extra text—just the array of responses.

BFI-2 questions:

const questions = [
    // Extraversion - Sociability
    "I am someone who is outgoing, sociable",
    "I am someone who is reserved", // R
    "I am someone who is energetic",
    
    // Extraversion - Assertiveness  
    "I am someone who is dominant, acts as a leader",
    "I am someone who is less active than other people", // R
    "I am someone who shows a lot of enthusiasm",
    
    // Agreeableness - Compassion
    "I am someone who is compassionate, has a soft heart",
    "I am someone who is cold and aloof", // R
    "I am someone who is helpful and unselfish with others",
    
    // Agreeableness - Respectfulness
    "I am someone who is respectful, treats others with respect",
    "I am someone who is rude to others", // R
    "I am someone who has a forgiving nature",
    
    // Conscientiousness - Organization
    "I am someone who does a thorough job",
    "I am someone who can be somewhat careless", // R
    "I am someone who is reliable, can always be counted on",
    
    // Conscientiousness - Productiveness
    "I am someone who tends to be efficient",
    "I am someone who tends to be lazy", // R
    "I am someone who perseveres until the task is finished",
    
    // Negative Emotionality - Anxiety
    "I am someone who worries a lot",
    "I am someone who is relaxed, handles stress well", // R
    "I am someone who gets nervous easily",
    
    // Negative Emotionality - Depression
    "I am someone who tends to feel depressed, blue",
    "I am someone who is emotionally stable, not easily upset", // R
    "I am someone who feels secure, comfortable with self",
    
    // Open-Mindedness - Intellectual Curiosity
    "I am someone who is original, comes up with new ideas",
    "I am someone who has few artistic interests", // R
    "I am someone who likes to reflect, play with ideas",
    
    // Open-Mindedness - Aesthetic Sensitivity
    "I am someone who values art and beauty",
    "I am someone who has little creativity", // R
    "I am someone who is sophisticated in art, music, or literature",
    
    // Additional Extraversion items
    "I am someone who is talkative",
    "I am someone who is sometimes shy, introverted", // R
    "I am someone who is full of energy",
    
    // Additional Agreeableness items  
    "I am someone who is generally trusting",
    "I am someone who tends to find fault with others", // R
    "I am someone who is considerate and kind to almost everyone",
    
    // Additional Conscientiousness items
    "I am someone who does things efficiently", 
    "I am someone who is easily distracted", // R
    "I am someone who makes plans and follows through with them",
    
    // Additional Negative Emotionality items
    "I am someone who can be tense",
    "I am someone who remains calm in tense situations", // R
    "I am someone who can be moody",
    
    // Additional Open-Mindedness items
    "I am someone who is inventive",
    "I am someone who prefers work that is routine", // R
    "I am someone who likes to reflect on things",
    
    // More Extraversion
    "I am someone who generates a lot of enthusiasm",
    "I am someone who tends to be quiet", // R
    "I am someone who has an assertive personality",
    
    // More Agreeableness
    "I am someone who is polite, courteous to others",
    "I am someone who can be cold and uncaring", // R
    "I am someone who is helpful when others are in need",
    
    // More Conscientiousness
    "I am someone who is systematic, likes to keep things in order",
    "I am someone who can be disorganized", // R
    "I am someone who is dependable, steady",
    
    // More Negative Emotionality
    "I am someone who is temperamental, gets emotional easily",
    "I am someone who is calm, even-tempered", // R
    "I am someone who feels anxious or worried a lot of the time",
    
    // More Open-Mindedness
    "I am someone who is curious about many different things",
    "I am someone who is conventional, traditional", // R
    "I am someone who thinks deeply about things",
    
    // Final items
    "I am someone who is creative, has new and original ideas",
    "I am someone who has little interest in speculating about things", // R
    "I am someone who is intellectually curious"
  ];

`;

  const { object } = await generateObject({
    model: openai(agent.llmSettings.model as string),
    temperature: agent.llmSettings.temperature,
    system: await parsePrompt(agent),
    schema: z.object({ results: z.array(z.string()) }),
    prompt,
  });

  const { data } = await supabase
    .from(process.env.BFI_TABLE_NAME as string)
    .select("*")
    .eq("email", agentId)
    .single();

  console.log(data);

  const results = arraySimilarity(object.results, data?.answers as string[]);

  return results.percent;
};

function itemSimilarity(a: string, b: string): number {
  const A = parseInt(a);
  const B = parseInt(b);
  // Similarity decreases as difference increases (range 0 to 1)
  const max = Math.max(Math.abs(A), Math.abs(B), 1); // Prevent division by zero
  const result = 1 - Math.abs(A - B) / max;

  return result;
}

export function arraySimilarity(
  arr1: string[],
  arr2: string[]
): { percent: number } {
  const minLength = Math.min(arr1.length, arr2.length);
  if (minLength === 0) return { percent: 0 };

  const similarities: number[] = [];
  for (let i = 0; i < minLength; i++) {
    similarities.push(itemSimilarity(arr1[i], arr2[i]));
  }
  const percent = (similarities.reduce((a, b) => a + b, 0) / minLength) * 100;
  return { percent };
}
