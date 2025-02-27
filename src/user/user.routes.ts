import { FastifyTypedInstance } from "../@types/fastifyTypedInstance";
import { handleToken } from "../utils/headersToken";
import { UserController } from "./user.controller";
import {
  userResponseSchema,
  userArrayResponseSchema,
  userRequestSchema,
  userErrorSchema,
  userParamsSchema,
  userRequestPatchSchema,
  userLoginReponnseSchema,
  userLoginSchema,
  userPhotoSchema,
} from "./user.schemas";

export async function userRoutes(app: FastifyTypedInstance) {
  const objUser = new UserController(app);

  app.get(
    "/user",
    {
      schema: {
        description: "List all users",
        tags: ["user"],
        response: {
          200: userArrayResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const users = await objUser.index();
      return reply.status(200).send(users);
    },
  );

  app.get(
    "/user/:id",
    {
      schema: {
        description: "Return a specific user",
        tags: ["user"],
        params: userParamsSchema,
        response: {
          200: userResponseSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await objUser.find(id, request.user as string);
      return reply.status(200).send(user);
    },
  );

  app.post(
    "/user",
    {
      schema: {
        description: "Register a new user",
        tags: ["user"],
        consumes: ["application/json"],
        body: userRequestSchema,
        response: {
          201: userResponseSchema,
          400: userErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const {} = request.body;
      const newUser = await objUser.create(request.body);
      return reply.status(201).send(newUser);
    },
  );

  app.patch(
    "/user/photo/:id",
    {
      schema: {
        description: "Registers or uploads (if already exists) the user`s photo",
        tags: ["user"],
        params: userParamsSchema,
        body: userPhotoSchema,
        consumes: ["multipart/form-data"],
        response: {
          400: userErrorSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const { avatar } = request.body;
      await objUser.photo(id, request.user as string, avatar);
      return reply.status(204).send();
    },
  );

  app.post(
    "/user/login",
    {
      schema: {
        description: "User`s login",
        tags: ["user"],
        body: userLoginSchema,
        response: {
          200: userLoginReponnseSchema,
          400: userErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const token = await objUser.login(email, password);
      return reply.status(200).send(token);
    },
  );

  app.patch(
    "/user/:id",
    {
      schema: {
        description: "Update a given user",
        tags: ["user"],
        params: userParamsSchema,
        body: userRequestPatchSchema,
        response: {
          200: userResponseSchema,
          400: userErrorSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const updated = await objUser.update(id, request.user as string, request.body);
      return reply.status(200).send(updated);
    },
  );

  app.delete(
    "/user/:id",
    {
      schema: {
        description: "Delete a given user",
        tags: ["user"],
        params: userParamsSchema,
        response: {
          200: userResponseSchema,
          400: userErrorSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const deleted = await objUser.delete(id, request.user as string);
      return reply.status(200).send(deleted);
    },
  );
}
