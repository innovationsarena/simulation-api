import { FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import {
  asyncHandler,
  AppError,
  saveTempFile,
  deleteTempFiles,
  listTempFiles,
} from "@core";

// Allowed file types
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

/**
 * Validate file type
 */
const validateFile = (file: MultipartFile): void => {
  const filename = file.filename.toLowerCase();
  const mimeType = file.mimetype;

  // Check extension
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    filename.endsWith(ext)
  );

  // Check mime type
  const hasValidMimeType = ALLOWED_MIME_TYPES.includes(mimeType);

  if (!hasValidExtension || !hasValidMimeType) {
    throw new AppError(
      `Invalid file type. Only .pdf and .docx files are allowed. Received: ${filename} (${mimeType})`,
      400
    );
  }
};

/**
 * Upload one or more knowledge documents
 */
export const uploadKnowledgeController = asyncHandler(
  async (request: FastifyRequest, reply: FastifyReply) => {
    const files = request.files();
    const uploadedFiles: Array<{
      fileId: string;
      filename: string;
      path: string;
      size: number;
    }> = [];

    for await (const file of files) {
      // Validate file type
      validateFile(file);

      // Read file buffer
      const buffer = await file.toBuffer();

      // Save to temp directory
      const { fileId, filePath, filename } = await saveTempFile(
        buffer,
        file.filename
      );

      uploadedFiles.push({
        fileId,
        filename: file.filename,
        path: filePath,
        size: buffer.length,
      });

      request.log.info(`File uploaded: ${file.filename} (ID: ${fileId})`);
    }

    if (uploadedFiles.length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    return reply.status(201).send({
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    });
  }
);

/**
 * Delete one or more knowledge documents
 */
export const deleteKnowledgeController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: {
        fileIds: string[];
      };
    }>,
    reply: FastifyReply
  ) => {
    const { fileIds } = request.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      throw new AppError(
        "fileIds array is required and must not be empty",
        400
      );
    }

    const result = await deleteTempFiles(fileIds);

    request.log.info(
      `Deleted ${result.deleted.length} file(s), failed: ${result.failed.length}`
    );

    return reply.status(200).send({
      message: `Deleted ${result.deleted.length} file(s)`,
      deleted: result.deleted,
      failed: result.failed,
    });
  }
);

/**
 * List all uploaded knowledge documents
 */
export const listKnowledgeController = asyncHandler(
  async (request: FastifyRequest, reply: FastifyReply) => {
    const files = await listTempFiles();

    return reply.status(200).send({
      message: `Found ${files.length} file(s)`,
      files,
    });
  }
);
