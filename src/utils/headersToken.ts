import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { APIError } from "./error";

export async function handleToken(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  try {
    const [, token] = String(request.headers["authorization"]).split(" ");
    if (!token) {
      throw new APIError("Token", "token validation missing", 401);
    }

    const { id, exp } = await request.jwtVerify<{ id: string; exp: number }>();

    request.user = id;

    done();
  } catch (e) {
    throw e;
  }
}
