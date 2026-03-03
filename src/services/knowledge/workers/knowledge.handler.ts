import { openai } from "@ai-sdk/openai";
import FormData from "form-data";
import { supabase, qdrantClient } from "@core";
import { embedMany } from "ai";
import { ragQueue } from ".";
import axios from "axios";
import { v5 as uuidv5 } from "uuid";

export const convertFile = async ({
  file,
  parentId,
}: {
  file: string;
  parentId: string;
}): Promise<void> => {
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

    await ragQueue.add("knowledge.file.chunk", {
      data: parsedDocument.json_content,
      parentId,
    });

    return;
  }
};

export const chunkFile = async ({
  data,
  parentId,
}: {
  data: string;
  parentId: string;
}): Promise<void> => {
  try {
    const chunks = await docling.chunk(data);
    await ragQueue.add("knowledge.file.embeddings", { chunks, parentId });
    return;
  } catch (error) {
    console.error(error);
  }
};

export const createEmbeddings = async ({
  chunks,
  parentId,
}: {
  chunks: any[];
  parentId: string;
}): Promise<void> => {
  console.log("Creating embeddings...");
  try {
    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: chunks.map((c) => c.text),
    });
    await ragQueue.add("knowledge.file.vector", {
      embeddings,
      chunks,
      parentId,
    });
    console.log("Embeddings created.");
    return;
  } catch (error) {
    console.log(error);
  }
};

export const storeEmbeddings = async ({
  embeddings,
  chunks,
  parentId,
}: {
  embeddings: any[];
  chunks: any[];
  parentId: string;
}) => {
  console.log("Store embeddings in vector Db...");
  try {
    const points = embeddings.map((vector, i) => {
      const chunk = chunks[i];
      const id = uuidv5(
        `${parentId}:${chunk.metadata.origin.filename.split("___")[1]}:${
          chunk.chunk_index
        }`,
        uuidv5.DNS
      );
      return {
        id,
        vector,
        payload: {
          parentId,
          text: chunk.text,
          filename: chunk.metadata.origin.filename,
          chunk_index: chunk.chunk_index,
          headings: chunk.headings,
          page_numbers: chunk.page_numbers,
          num_tokens: chunk.num_tokens,
          // metadata: chunk.metadata,
        },
      };
    });

    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some((c) => c.name === parentId);

    if (!exists) {
      await qdrantClient.createCollection(parentId, {
        vectors: { size: 1536, distance: "Cosine" },
      });
    }

    await qdrantClient.upsert(parentId, { points });

    console.log("Embeddings stored.");
    return;
  } catch (error) {
    console.error("Error storing embeddings: ", error);
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
  async chunk(doc: any): Promise<any> {
    console.log("Chunking document...");

    try {
      const docString = typeof doc === "string" ? doc : JSON.stringify(doc);
      const base64String = Buffer.from(docString, "utf-8").toString("base64");

      const docObj = typeof doc === "string" ? JSON.parse(doc) : doc;
      const source = {
        base64_string: base64String,
        filename: `${docObj.name}.json`,
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
