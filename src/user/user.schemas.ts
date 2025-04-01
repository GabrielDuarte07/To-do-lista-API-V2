import { MultipartFile } from "@fastify/multipart";
import { z } from "zod";

export const userRequestSchema = z
  .object({
    name: z.string({ required_error: "name required" }),
    email: z.string({ required_error: "e-mail required" }).email("Invalid E-mail"),
    password: z.string({ required_error: "password required" }),
    confirm_password: z.string({ required_error: "confirmation required" }),
  })
  .refine(data => data.confirm_password === data.password, {
    message: "Password and confirmarion don`t match",
    path: ["confirm_password"],
  })
  .describe("<h4>`The avatar field is optional`</h4>");

export const userLoginSchema = z.object({
  email: z.string({ required_error: "Email required" }).email("Invalid email"),
  password: z.string({ required_error: "password required" }),
});

export const userLoginReponnseSchema = z.object({
  token: z.string(),
  id: z.string().uuid(),
});

export const userRequestPatchSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email("Invalid E-mail")),
    password: z.optional(z.string()),
    confirm_password: z.optional(z.string()),
  })
  .refine(
    data => {
      if (data.password && data.password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "Password and confirmarion don`t match",
      path: ["confirm_password"],
    },
  )
  .describe("<h4>`All fields are optional`</h4>");

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const userArrayResponseSchema = z.array(userResponseSchema);

export const userParamsSchema = z.object({
  id: z.string({ required_error: "UUID Required" }).uuid("Invalid UUID"),
});

export const userErrorSchema = z
  .object({
    name: z.string({ description: "Error`s name" }),
    message: z.string({ description: "Error`s message" }),
  })
  .describe("Error with name and message");

export const userPhotoSchema = z.object({
  avatar: z.custom<MultipartFile>().describe(`Image Required`),
});
