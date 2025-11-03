import { FastifyInstance } from "fastify";
import { validateKey } from "@middlewares";
import { uploadKnowledgeController, deleteKnowledgeController, listKnowledgeController } from "@controllers";

export const knowledgeRouter = (fastify: FastifyInstance) => {
  /**
   * Upload knowledge documents (.pdf, .docx)
   */
  fastify.post(
    "/knowledge",
    {
      preValidation: [validateKey],
    },
    uploadKnowledgeController
  );

  /**
   * Delete knowledge documents by IDs
   */
  fastify.delete(
    "/knowledge",
    {
      preValidation: [validateKey],
    },
    deleteKnowledgeController
  );

  /**
   * List all uploaded knowledge documents
   */
  fastify.get(
    "/knowledge",
    {
      preValidation: [validateKey],
    },
    listKnowledgeController
  );
};
