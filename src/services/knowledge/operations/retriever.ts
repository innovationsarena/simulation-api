import { openai } from "@ai-sdk/openai";
import { supabase } from "@core";
import { BaseRetriever } from "@voltagent/core";
import { embed } from "ai";

class MyRetriever extends BaseRetriever {
  async retrieve(input: string | Record<string, any>, options: any) {
    console.log(input);
    console.log("Retrieving...");
    // 1. Get the user's question
    const question =
      typeof input === "string" ? input : input[input.length - 1].content;

    // 2. Search your data source
    const results = await this.searchMyData(question);
    console.log(results);
    // 3. Return formatted results
    return "";
  }

  async searchMyData(query: string) {
    // Translate query into embedding
    const { embedding: queryVector } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    });

    // Search in vectorDb

    return "";
  }
}

export const retriever = new MyRetriever();
