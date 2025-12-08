import { embed } from "ai";
import { qdrant } from ".";
import { openai } from "@ai-sdk/openai";
import { BaseMessage, BaseRetriever, RetrieveOptions } from "@voltagent/core";

// Retriever function
async function retrieveDocuments(query: string, topK = 3) {
  try {
    // Generate embedding for the query
    const embeddingResponse = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
    });

    const queryVector = embeddingResponse.embedding;
    // Perform search in Qdrant
    const searchResults = (
      await qdrant.query("test", {
        query: queryVector,
        limit: topK,
        with_payload: true,
      })
    ).points;
    // Format results
    return (
      searchResults.map((match: any) => ({
        content: match.payload?.text || "",
        metadata: match.payload || {},
        score: match.score || 0,
        id: match.id,
      })) || []
    );
  } catch (error) {
    console.error("Error retrieving documents from Qdrant:", error);
    return [];
  }
}

/**
 * Qdrant-based retriever implementation for VoltAgent
 */
export class QdrantRetriever extends BaseRetriever {
  /**
   * Retrieve documents from Qdrant based on semantic similarity
   * @param input - The input to use for retrieval (string or BaseMessage[])
   * @param options - Configuration and context for the retrieval
   * @returns Promise resolving to a formatted context string
   */
  async retrieve(
    input: string | BaseMessage[],
    options: RetrieveOptions
  ): Promise<string> {
    // Convert input to searchable string
    let searchText = "";
    if (typeof input === "string") {
      searchText = input;
    } else if (Array.isArray(input) && input.length > 0) {
      const lastMessage = input[input.length - 1];
      if (Array.isArray(lastMessage.content)) {
        const textParts = lastMessage.content
          .filter((part: any) => part.type === "text")
          .map((part: any) => part.text);
        searchText = textParts.join(" ");
      } else {
        searchText = lastMessage.content as string;
      }
    }
    // Perform semantic search using Qdrant
    const results = await retrieveDocuments(searchText, 3);
    // Add references to context if available
    if (options.context && results.length > 0) {
      const references = results.map((doc: any, index: number) => ({
        id: doc.id,
        title: doc.metadata.topic || `Document ${index + 1}`,
        source: "Qdrant Knowledge Base",
        score: doc.score,
        category: doc.metadata.category,
      }));
      options.context.set("references", references);
    }
    // Return the concatenated content for the LLM
    if (results.length === 0) {
      return "No relevant documents found in the knowledge base.";
    }
    return results
      .map(
        (doc: any, index: number) =>
          `Document ${index + 1} (ID: ${doc.id}, Score: ${doc.score.toFixed(
            4
          )}, Category: ${doc.metadata.category}):\n${doc.content}`
      )
      .join("\n\n---\n\n");
  }
}

// Create retriever instance
export const retriever = new QdrantRetriever();
