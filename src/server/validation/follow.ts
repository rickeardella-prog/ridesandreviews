import { z } from "zod";

export const followSchema = z.object({
  followeeId: z.string().uuid(),
});

export type FollowInput = z.infer<typeof followSchema>;
