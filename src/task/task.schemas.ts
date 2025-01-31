import { z } from "zod";

export const taskErrorsSchema = z.object({
  name: z.string(),
  message: z.string(),
});

export const taskParamsSchema = z.object({
  id: z.string({ required_error: "UUID required" }).uuid({ message: "UUID invalid" }),
});

export const taskResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  scheduled_datetime: z.date().nullable(),
  done: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  user_id: z.string().uuid(),
});

export const taskRequestSchema = z
  .object({
    title: z.string({ required_error: "title required" }),
    description: z.optional(z.string()).transform(data => data ?? null),
    scheduled_datetime: z
      .optional(z.string().datetime())
      .transform(data => (data ? new Date(data) : null)),
    done: z.boolean({ required_error: "done required" }),
    user_id: z.string({ required_error: "user ID required" }).uuid("UUID invalid"),
  })
  .describe("<h4>`The fields description and scheduled_datetime are optional`</h4>");

export const taskArrayResponseSchema = z.array(taskResponseSchema);

export const taskRequestOptionalSchema = z
  .object({
    title: z.optional(z.string()),
    description: z.optional(z.string()),
    scheduled_datetime: z.optional(z.date()),
    done: z.optional(z.boolean()),
  })
  .describe("<h4>`All fields are optional`</h4>");
