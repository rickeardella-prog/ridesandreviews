import { z } from "zod";

const base = {
  rating: z.number().int().min(1).max(10),
  body: z.string().max(5000).optional(),
};

export const createReviewSchema = z.union([
  z.object({ parkId: z.string().uuid(), ...base }),
  z.object({ rideId: z.string().uuid(), ...base }),
]);

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
