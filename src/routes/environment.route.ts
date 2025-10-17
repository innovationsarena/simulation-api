import { FastifyInstance } from "fastify";
import {
  createEnvironmentController,
  deleteEnvironmentController,
  updateEnvironmentController,
  getEnvironmentController,
} from "@controllers";
import { EnvironmentInputSchema } from "@core";
import { validateKey } from "@middlewares";

export const environmentRouter = (fastify: FastifyInstance) => {
  fastify.post(
    "/environments",
    {
      schema: EnvironmentInputSchema,
      preValidation: [validateKey],
    },
    createEnvironmentController
  );

  fastify.get(
    "/environments/:environmentId",
    {
      schema: {},
      preValidation: [validateKey],
    },
    getEnvironmentController
  );

  fastify.patch(
    "/environments/:environmentId",
    {
      schema: EnvironmentInputSchema,
      preValidation: [validateKey],
    },
    updateEnvironmentController
  );
  fastify.delete(
    "/environments/:environmentId",
    {
      schema: {},
      preValidation: [validateKey],
    },
    deleteEnvironmentController
  );
};
