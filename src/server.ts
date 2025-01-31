import { fastify } from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fastifyBcrypt } from "fastify-bcrypt";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifyJwt } from "@fastify/jwt";
import { handleError } from "./utils/error";
import { userRoutes } from "./user/user.routes";
import { taskRoutes } from "./task/task.routes";
import path from "node:path";

const app = fastify();

app.register(fastifyJwt, { secret: "mysecret", sign: { expiresIn: "1d" } });

app.register(fastifyMultipart, {
  attachFieldsToBody: true,
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "To do list API",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, { routePrefix: "/docs" });

app.register(fastifyBcrypt, { saltWorkFactor: 10 });

app.setErrorHandler(handleError);

app.register(userRoutes);
app.register(taskRoutes);

app
  .listen({ port: Number(process.env.PORT) })
  .then(() => console.log(`API running on port ${process.env.PORT} `));
