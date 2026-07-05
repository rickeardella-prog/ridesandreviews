import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_]+$/i, "letters, numbers, and underscores only"),
  displayName: z.string().min(1).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export type SignupInput = z.infer<typeof signupSchema>;
