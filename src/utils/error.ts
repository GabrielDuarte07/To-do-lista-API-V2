import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export function handleError(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  return reply.status(error.statusCode ?? 400).send({ message: error.message, name: error.name });
}

export class APIError implements FastifyError {
  public code = "";
  public name: string;
  public message: string;
  public statusCode: number;

  constructor(name: string, message: string, statusCode: number) {
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}
