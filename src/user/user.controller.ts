import { FastifyTypedInstance } from "../@types/fastifyTypedInstance";
import { User, UserControllerProps } from "./user.interfaces";
import { ControllerProperties } from "../utils/ControllerProperties";
import { APIError } from "../utils/error";
import fs from "node:fs/promises";
import path from "node:path";
import { MultipartFile } from "@fastify/multipart";

export class UserController implements UserControllerProps {
  private defaultProps: ControllerProperties;

  constructor(app: FastifyTypedInstance) {
    this.defaultProps = new ControllerProperties(app);
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const findUser = await this.defaultProps.connection.user.findUnique({ where: { email } });
    if (!findUser) {
      throw new APIError("Login", "User not found", 404);
    }

    const compared = await this.defaultProps.app.bcrypt.compare(password, findUser.password);
    if (!compared) {
      throw new APIError("Password", "Wrong Password", 404);
    }

    const token = this.defaultProps.app.jwt.sign({ id: findUser.id });
    return {
      token,
    };
  }

  async index(): Promise<Omit<User, "password">[]> {
    const users = await this.defaultProps.connection.user.findMany({ omit: { password: true } });
    return users;
  }

  async find(idParam: string, idUser: string): Promise<Omit<User, "password">> {
    if (idParam !== idUser) {
      throw new APIError("token", "Invalid token", 404);
    }

    const user = await this.defaultProps.connection.user.findUnique({
      where: { id: idParam },
      omit: { password: true },
    });
    if (!user) {
      throw new APIError("ID", "User not found", 404);
    }
    return user;
  }

  async create({
    name,
    email,
    password,
  }: Pick<User, "name" | "email" | "password">): Promise<Omit<User, "password">> {
    const findEmail = await this.defaultProps.connection.user.findFirst({ where: { email } });

    if (findEmail) {
      throw new APIError("E-mail", "E-mail already exists", 400);
    }

    const hashed = await this.defaultProps.app.bcrypt.hash(password);

    const newUser = await this.defaultProps.connection.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
    return newUser;
  }

  async photo(idParam: string, idUser: string, img?: MultipartFile): Promise<void> {
    if (idParam !== idUser) {
      throw new APIError("token", "invalid token", 401);
    }
    if (!img) {
      throw new APIError("avatar", "Avatar is required", 400);
    }

    const userExists = await this.defaultProps.connection.user.findUnique({
      where: { id: idParam },
    });
    if (!userExists) {
      throw new APIError("User", "User not found", 404);
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(img.mimetype)) {
      throw new APIError("Type file", "The File must be an image", 400);
    }

    const ext = img.filename.slice(img.filename.lastIndexOf("."));
    const destination =
      path.resolve(__dirname, "..", "..", "public", "images") + `/${idParam}${ext}`;
    await fs.writeFile(destination, img.file);
    await this.defaultProps.connection.user.update({
      where: { id: idParam },
      data: { avatar: `${idParam}${ext}` },
    });
    return;
  }

  async update(
    idParam: string,
    idUser: string,
    { name, email, password }: Partial<Omit<User, "id" | "created_at" | "updated_at">>,
  ): Promise<Omit<User, "password">> {
    if (idParam !== idUser) {
      throw new APIError("token", "invalid token", 401);
    }

    const findUser = await this.defaultProps.connection.user.findUnique({ where: { id: idParam } });
    if (!findUser) {
      throw new APIError("ID", "User not found", 404);
    }

    if (email && email !== findUser.email) {
      const emailExists = await this.defaultProps.connection.user.findUnique({ where: { email } });
      if (emailExists) {
        throw new APIError("E-mail", "E-mail already exists", 400);
      }
    }

    const updated = await this.defaultProps.connection.user.update({
      data: {
        name: name ?? findUser.name,
        email: email ?? findUser.email,
        password: password ?? findUser.password,
      },
      where: { id: idParam },
    });

    return updated;
  }
  async delete(idParam: string, idUser: string): Promise<Omit<User, "password">> {
    if (idParam !== idUser) {
      throw new APIError("token", "invalid token", 401);
    }

    const findUser = await this.defaultProps.connection.user.findUnique({ where: { id: idParam } });
    if (!findUser) {
      throw new APIError("ID", "User not found", 404);
    }

    const deleted = await this.defaultProps.connection.user.delete({ where: { id: idParam } });
    return deleted;
  }
}
