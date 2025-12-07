import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { pipeline } from "stream/promises";
import { MultipartFile } from "@fastify/multipart";
import { ragQueue } from "../workers";

export const uploadsDir = path.join(__dirname, "uploads");

export const uploadFiles = async (files: MultipartFile[]) => {
  // Ensure uploads directory exists
  await fsp.mkdir(uploadsDir, { recursive: true });

  const uploadedFiles: { filename: string; path: string; mimetype: string }[] =
    [];

  for await (const file of files) {
    const filename = `${Date.now()}-${file.filename}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file to disk
    await pipeline(file.file, fs.createWriteStream(filepath));

    uploadedFiles.push({
      filename: file.filename,
      path: filepath,
      mimetype: file.mimetype,
    });
  }

  for (const file of uploadedFiles) {
    await ragQueue.add("knowledge.file.parse", file);
  }

  return uploadedFiles;
};
