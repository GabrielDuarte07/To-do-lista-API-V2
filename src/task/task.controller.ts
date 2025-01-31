import { Task, TaskControllerProps } from "./task.interfaces";
import { ControllerProperties } from "../utils/ControllerProperties";
import { FastifyTypedInstance } from "../@types/fastifyTypedInstance";
import { APIError } from "../utils/error";

export class TaskController implements TaskControllerProps {
  private defaultProps: ControllerProperties;

  constructor(app: FastifyTypedInstance) {
    this.defaultProps = new ControllerProperties(app);
  }

  async findUser(userID: string): Promise<boolean> {
    const findUser = await this.defaultProps.connection.user.findUnique({ where: { id: userID } });
    return !!findUser;
  }

  async index(userIdParam: string, userIdAuth: string): Promise<Task[]> {
    if (!this.findUser(userIdParam)) {
      throw new APIError("User`s tasks", "User not found", 404);
    }

    if (userIdParam !== userIdAuth) {
      throw new APIError("validation", "invalid token", 401);
    }

    const tasks = await this.defaultProps.connection.task.findMany({
      where: { user_id: userIdParam },
    });
    if (tasks.length === 0) {
      throw new APIError("User`s tasks", "None task found", 404);
    }

    return tasks;
  }

  async find(idTask: string, idUser: string): Promise<Task> {
    const findTask = await this.defaultProps.connection.task.findUnique({ where: { id: idTask } });
    if (!findTask) {
      throw new APIError("Task", "task not found", 404);
    }

    if (findTask.user_id !== idUser) {
      throw new APIError("Validation", "Token invalid", 401);
    }

    return findTask;
  }

  async create(
    idUserAuth: string,
    taskData: Omit<Task, "id" | "created_at" | "updated_at">,
  ): Promise<Task> {
    if (idUserAuth !== taskData.user_id) {
      throw new APIError("Validation", "Token invalid", 401);
    }

    if (!this.findUser(taskData.user_id)) {
      throw new APIError("New Task", "User not found", 404);
    }

    const sameTitle = await this.defaultProps.connection.task.findFirst({
      where: { user_id: taskData.user_id, title: taskData.title },
    });

    if (sameTitle) {
      throw new APIError("New Task", "You already have a task with this name", 400);
    }

    const newTask = await this.defaultProps.connection.task.create({ data: taskData });
    return newTask;
  }

  async update(
    idTask: string,
    idUserAuth: string,
    {
      done,
      description,
      scheduled_datetime,
      title,
    }: Partial<Omit<Task, "id" | "created_at" | "updated_at" | "user_id">>,
  ): Promise<Task> {
    if (!this.findUser(idUserAuth)) {
      throw new APIError("Update task", "User not found", 404);
    }

    const findTask = await this.defaultProps.connection.task.findUnique({ where: { id: idTask } });
    if (!findTask) {
      throw new APIError("Update task", "Task not found", 404);
    }

    if (findTask.user_id !== idUserAuth) {
      throw new APIError("Validation", "Token invalid", 401);
    }

    if (title) {
      const findTitle = await this.defaultProps.connection.task.findFirst({
        where: { user_id: idUserAuth },
      });
      if (findTitle) {
        throw new APIError("New Task", "You already have a task with this name", 400);
      }
    }

    const updated = await this.defaultProps.connection.task.update({
      where: { id: idTask },
      data: {
        title: title ?? findTask.title,
        description: description ?? findTask.description,
        done: done ?? findTask.done,
        scheduled_datetime: scheduled_datetime ?? findTask.scheduled_datetime,
      },
    });

    return updated;
  }

  async delete(idTask: string, idUserAuth: string): Promise<Task> {
    const findTask = await this.defaultProps.connection.task.findUnique({ where: { id: idTask } });
    if (!findTask) {
      throw new APIError("Delete task", "Task not found", 404);
    }

    if (findTask.user_id !== idUserAuth) {
      throw new APIError("Validation", "Token invalid", 401);
    }

    const deleted = await this.defaultProps.connection.task.delete({ where: { id: idTask } });
    return deleted;
  }
}
