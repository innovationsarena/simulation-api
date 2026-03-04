import { FastifyInstance } from "fastify";
import { validateKey } from "@middlewares";

import { fileUploadController } from "@controllers";

export const knowledgeRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/knowledge/files",
    {
      schema: {
        consumes: ["multipart/form-data"],
      },
      preValidation: [validateKey],
    },
    fileUploadController
  );
};
