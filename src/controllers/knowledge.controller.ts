import { FastifyReply, FastifyRequest } from "fastify";
import { ragQueue } from "@services/knowledge/workers";
import { uploadFiles } from "../services";
import { asyncHandler } from "../core";

export const fileUploadController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { agentId?: string; simulationId?: string };
    }>,
    reply: FastifyReply
  ) => {
    const files: { buffer: Buffer; filename: string; mimetype: string }[] = [];

    let parentId = null;

    // Check for path params
    const { agentId, simulationId } = request.params;

    if (agentId) parentId = agentId;
    if (simulationId) parentId = simulationId;

    // Get all uploaded files — consume buffers eagerly while iterating
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === "file") {
        const buffer = await part.toBuffer();
        files.push({
          buffer,
          filename: part.filename,
          mimetype: part.mimetype,
        });
      }
    }

    if (files.length === 0) {
      return reply.status(400).send({ error: "No files uploaded" });
    }

    // Upload files to Supabase
    const uploadedFiles = await uploadFiles(files);

    // Send to queue
    for (const file of uploadedFiles) {
      await ragQueue.add("knowledge.file.convert", { file, parentId });
    }

    return reply.status(200).send({
      message: "File(s) upload successful.",
      files: uploadedFiles,
    });
  }
);
