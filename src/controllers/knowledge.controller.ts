import { FastifyReply, FastifyRequest } from "fastify";
import { ragQueue } from "@services/knowledge/workers";
import { MultipartFile } from "@fastify/multipart";
import { uploadFiles } from "../services";
import { asyncHandler } from "../core";

export const fileUploadController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { agentId?: string; simulationId?: string };
    }>,
    reply: FastifyReply
  ) => {
    const files: MultipartFile[] = [];

    let parent = null;
    // Check for path params
    const { agentId, simulationId } = request.params;

    if (agentId) parent = agentId;
    if (simulationId) parent = simulationId;

    // Get all uploaded files
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file") {
        files.push(part);
      }
    }

    if (files.length === 0) {
      return reply.status(400).send({ error: "No files uploaded" });
    }

    // Upload files to Supabase
    const uploadedFiles = await uploadFiles(files);

    // Send to queue
    for await (const file of uploadedFiles) {
      await ragQueue.add("knowledge.file.convert", { file, parent });
    }

    return reply.status(200).send({
      message: "File upload successful.",
      files: uploadedFiles,
    });
  }
);
