import { PrismaClient } from "@prisma/client";
import { FastifyTypedInstance } from "../@types/fastifyTypedInstance";

export class ControllerProperties {
  constructor(
    public app: FastifyTypedInstance = app,
    public connection: PrismaClient = new PrismaClient(),
  ) {}
}
