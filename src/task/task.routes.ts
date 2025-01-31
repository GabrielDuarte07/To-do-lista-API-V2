import { FastifyTypedInstance } from "../@types/fastifyTypedInstance";
import { handleToken } from "../utils/headersToken";
import { TaskController } from "./task.controller";
import {
  taskArrayResponseSchema,
  taskParamsSchema,
  taskRequestOptionalSchema,
  taskRequestSchema,
  taskResponseSchema,
} from "./task.schemas";

export async function taskRoutes(app: FastifyTypedInstance) {
  const objTask = new TaskController(app);

  app.get(
    "/task/user/:id",
    {
      schema: {
        description: "Return all tasks of a user",
        tags: ["task", "user"],
        params: taskParamsSchema,
        response: {
          200: taskArrayResponseSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const tasks = await objTask.index(id, request.user as string);
      return reply.status(200).send(tasks);
    },
  );

  app.get(
    "/task/:id",
    {
      schema: {
        description: "Return a specific task",
        tags: ["task"],
        params: taskParamsSchema,
        response: {
          200: taskResponseSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {},
  );

  app.post(
    "/task",
    {
      schema: {
        description: "Registers a new task",
        tags: ["task"],
        body: taskRequestSchema,
        response: {
          201: taskResponseSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const inserted = await objTask.create(request.user as string, request.body);
      return reply.status(201).send(inserted);
    },
  );

  app.patch(
    "/task/:id",
    {
      schema: {
        description: "Update a task",
        tags: ["task"],
        params: taskParamsSchema,
        body: taskRequestOptionalSchema,
        response: {
          200: taskResponseSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const updated = await objTask.update(id, request.user as string, request.body);
      return reply.status(200).send(updated);
    },
  );

  app.delete(
    "/task/:id",
    {
      schema: {
        description: "Delete a task",
        tags: ["task"],
        params: taskParamsSchema,
        response: {
          200: taskResponseSchema,
        },
      },
      preHandler: handleToken,
    },
    async (request, reply) => {
      const { id } = request.params;
      const deleted = await objTask.delete(id, request.user as string);
      return reply.status(200).send(deleted);
    },
  );
}
