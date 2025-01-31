export type Task = {
  id: string;
  title: string;
  description: string | null;
  scheduled_datetime: Date | null;
  done: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: string;
};

export interface TaskControllerProps {
  findUser(userID: string): Promise<boolean>;

  index(userId: string, userIdAuth: string): Promise<Task[]>;

  find(idTask: string, idUserAuth: string): Promise<Task>;

  create(
    idUserAuth: string,
    taskData: Omit<Task, "id" | "created_at" | "updated_at">,
  ): Promise<Task>;

  update(
    idTask: string,
    idUserAuth: string,
    taskData: Partial<Omit<Task, "id" | "created_at" | "updated_at" | "user_id">>,
  ): Promise<Task>;

  delete(idTask: string, idUserAuth: string): Promise<Task>;
}
