import { FastifyReply, FastifyRequest } from "fastify";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleControllerError = (error: unknown): never => {
  if (error instanceof AppError) {
    throw new AppError(error.message, error.statusCode);
  }

  if (error instanceof Error) {
    throw new AppError(error.message, 500);
  }

  throw new AppError("Internal server error", 500);
};

export const asyncHandler = (fn: Function) => {
  return async (request: any, reply: FastifyReply) => {
    try {
      return await fn(request, reply);
    } catch (error) {
      if (error instanceof AppError) {
        reply.log.error(error.message);
        return reply.status(error.statusCode).send({ error: error.message });
      }

      if (error instanceof Error) {
        reply.log.error(error.message);
        return reply.status(500).send({ error: error.message });
      }

      reply.log.error("Unknown error occurred");
      return reply.status(500).send({ error: "Internal server error" });
    }
  };
};
