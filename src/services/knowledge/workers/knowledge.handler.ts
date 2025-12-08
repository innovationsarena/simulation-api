import { openai } from "@ai-sdk/openai";
import { qdrant } from "../operations";
import { randomUUID } from "crypto";
import FormData from "form-data";
import { supabase } from "@core";
import { embedMany } from "ai";
import { ragQueue } from ".";
import axios from "axios";

export const convertFile = async (file: string): Promise<void> => {
  // Get file from supabase
  const { data: fileInfo } = await supabase.storage
    .from(process.env.TEMP_BUCKET as string)
    .info(file);
  const { data: fileBlob } = await supabase.storage
    .from(process.env.TEMP_BUCKET as string)
    .download(file);

  if (fileBlob && fileInfo) {
    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

    const parsedDocument = await docling.convert(
      fileBuffer,
      fileInfo?.name as string
    );

    // remove file from uploads
    await supabase.storage
      .from(process.env.TEMP_BUCKET as string)
      .remove([fileInfo.name]);

    await ragQueue.add(
      "knowledge.file.chunk",
      JSON.stringify(parsedDocument.json_content)
    );

    return;
  }
};

export const chunkFile = async (parsedDocument: string): Promise<void> => {
  try {
    const chunks = await docling.chunk(parsedDocument);
    await ragQueue.add("knowledge.file.embeddings", chunks);
    return;
  } catch (error) {
    console.error(error);
  }
};

export const createEmbeddings = async (chunks: any[]): Promise<void> => {
  console.log("Creating embeddings...");
  try {
    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: chunks.map((c) => c.text),
    });
    await ragQueue.add("knowledge.file.vector", { embeddings, chunks });
    console.log("Embeddings created.");
    return;
  } catch (error) {
    console.log(error);
  }
};

export const storeEmbeddings = async ({
  embeddings,
  chunks,
}: {
  embeddings: any[];
  chunks: any[];
}) => {
  console.log("Store embeddings in qdrant...");
  try {
    const COLLECTION = "test";

    const points = embeddings.map((item, i) => {
      const chunk = chunks[i];

      return {
        id: randomUUID(), // any unique id
        vector: item, // the embedding
        payload: {
          text: chunk.text,
          filename: chunk.filename,
          chunk_index: chunk.chunk_index,
          headings: chunk.headings,
          page_numbers: chunk.page_numbers,
          num_tokens: chunk.num_tokens,
          metadata: chunk.metadata,
        },
      };
    });

    console.log(`Upserting ${points.length} points...`);

    const res = await qdrant.upsert(COLLECTION, {
      points,
    });

    console.log(res);
    console.log("Embeddings stored.");
    return;
  } catch (error) {
    console.error("Error storing embeddings:", error);
    throw error;
  }
};

/* Docling client */
const docling = {
  async convert(fileBuffer: any, fileName: string): Promise<any> {
    console.log("Converting document...");

    const form = new FormData();

    form.append("files", fileBuffer, fileName); // or whatever filename
    form.append("to_formats", "md");
    form.append("to_formats", "json");

    try {
      const { data } = await axios.post(
        `${process.env.DOCLING_URL}/convert/file`,
        form,
        {
          headers: {
            "X-Api-Key": process.env.DOCLING_API_KEY as string,
            ...form.getHeaders(),
          },
        }
      );

      console.log("Document converted.");

      return data.document;
    } catch (error) {
      console.log("File convertion failed.");
      return "File convertion failed.";
    }
  },
  async chunk(doc: string): Promise<any> {
    console.log("Chunking document...");

    try {
      const base64String = Buffer.from(doc, "utf-8").toString("base64");

      const source = {
        base64_string: base64String,
        filename: `${JSON.parse(doc).name}.json`,
        kind: "file",
      };

      const { data } = await axios.post(
        `${process.env.DOCLING_URL}/chunk/hybrid/source`,
        {
          convert_options: {
            from_formats: ["json_docling"],
            to_formats: ["md"],
          },
          sources: [source],
        },
        {
          headers: {
            "X-Api-Key": process.env.DOCLING_API_KEY as string,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Document chunked.");

      return data.chunks;
    } catch (error) {
      console.error(error);
    }
  },
};
