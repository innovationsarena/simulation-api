import { FastifyReply, FastifyRequest } from "fastify";
import { asyncHandler, Environment, EnvironmentInput, id } from "../core";

import {
  createEnvironment,
  deleteEnvironment,
  getEnvironment,
  updateEnvironment,
} from "../services";

export const createEnvironmentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Body: Omit<Environment, "id">;
    }>,
    reply: FastifyReply
  ) => {
    const { simulationId, description, objectives, constraints, values } =
      request.body;

    const newEnvironment = {
      id: id(8),
      simulationId,
      description,
      objectives: objectives || [], // Ex. Goals
      constraints: constraints || [], // Ex. Budget
      values: values || [], // Ex. Culture
    };

    const environment = await createEnvironment(newEnvironment);
    return reply.status(201).send(environment);
  }
);

export const getEnvironmentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { environmentId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { environmentId } = request.params;

    const environment = await getEnvironment(environmentId);

    if (!environment)
      reply
        .status(404)
        .send({ message: "Environment with given ID not found." });

    reply.status(200).send(environment);
  }
);

export const updateEnvironmentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { environmentId: string };
      Body: EnvironmentInput;
    }>,
    reply: FastifyReply
  ) => {
    const { environmentId } = request.params;

    const environment = await getEnvironment(environmentId);

    const updatedEnvironment = await updateEnvironment({
      ...environment,
      ...request.body,
    });

    if (!environment)
      reply
        .status(404)
        .send({ message: "Environment with given ID not found." });

    reply.status(200).send(updateEnvironment);
  }
);

export const deleteEnvironmentController = asyncHandler(
  async (
    request: FastifyRequest<{
      Params: { environmentId: string };
    }>,
    reply: FastifyReply
  ) => {
    const { environmentId } = request.params;

    await deleteEnvironment(environmentId);

    return reply
      .status(200)
      .send({ message: `Environment with id ${environmentId} deleted.` });
  }
);
