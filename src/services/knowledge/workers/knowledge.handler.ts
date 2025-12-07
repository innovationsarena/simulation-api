import axios from "axios";
import { readFile } from "fs/promises";
import FormData from "form-data";

type FileInfo = { filename: string; path: string; mimetype: string };

export const parseFile = async (fileInfo: FileInfo) => {
  console.log("Parsing file...");

  // Convert to buffert
  const fileBuffer = await readFile(fileInfo.path);

  // post to docling
  const parsedDocument = await docling.convert(fileBuffer, fileInfo.filename);

  // remove file from uploads
  return parsedDocument;
};

export const chunkFile = async (parsedDocument: string) => {};
export const createEmbeddings = async (chunks: any[]) => {};
export const storeEmbeddings = async (embeddings: any[]) => {};

const docling = {
  async convert(fileBuffer: any, fileName: string) {
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
      console.log(data);
    } catch (error) {
      console.log("File convertion failed.");
      return "File convertion failed.";
    }
  },
};
