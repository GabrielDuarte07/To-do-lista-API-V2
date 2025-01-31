import { MultipartFile } from "@fastify/multipart";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export interface UserControllerProps {
  index(): Promise<Omit<User, "password">[]>;

  find(idParam: string, idUser: string): Promise<Omit<User, "password">>;

  create(userData: Pick<User, "name" | "email" | "password">): Promise<Omit<User, "password">>;

  photo(idParam: string, iduser: string, img?: MultipartFile): Promise<void>;

  login(email: string, password: string): Promise<{ token: string }>;

  update(
    idParam: string,
    idUser: string,
    userData: Partial<Omit<User, "id" | "created_at" | "updated_at" | "avatar">>,
  ): Promise<Omit<User, "password">>;

  delete(idParam: string, idUser: string): Promise<Omit<User, "password">>;
}
