import { openai } from "@ai-sdk/openai";
import { qdrantClient } from "@core";
import {
  BaseRetriever,
  type BaseMessage,
  type RetrieveOptions,
} from "@voltagent/core";
import { embed } from "ai";

class QdrantRetriever extends BaseRetriever {
  constructor() {
    super({
      toolName: "qdrant-retriever",
      toolDescription: "Searches knowledge base for relevant documents",
    });
  }

  async retrieve(
    input: string | BaseMessage[],
    options: RetrieveOptions
  ): Promise<string> {
    console.log("[QdrantRetriever] retrieve called");

    let searchText: string;
    if (typeof input === "string") {
      searchText = input;
    } else {
      const last = input[input.length - 1];
      searchText =
        typeof last?.content === "string"
          ? last.content
          : Array.isArray(last?.content)
          ? last.content
              .filter((p: any) => p.type === "text")
              .map((p: any) => p.text)
              .join(" ")
          : "";
    }

    const parentId =
      options?.context?.get?.("parentId") ??
      (options?.context as any)?.parentId;

    if (!parentId) {
      console.warn("QdrantRetriever: no parentId in context, skipping");
      return "";
    }

    if (!searchText) {
      console.warn("QdrantRetriever: empty search text, skipping");
      return "";
    }

    const { embedding: queryVector } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: searchText,
    });

    const results = await qdrantClient.search(parentId as string, {
      vector: queryVector,
      limit: 5,
    });

    if (options.context && results.length > 0) {
      const references = results.map((r, i) => ({
        index: i + 1,
        filename: r.payload?.filename,
        score: r.score,
      }));
      options.context.set("references", references);
    }

    return results
      .map((r, i) => `Document ${i + 1}:\n${r.payload?.text ?? ""}`)
      .filter((t) => t.trim())
      .join("\n\n---\n\n");
  }
}

export const retriever = new QdrantRetriever();
