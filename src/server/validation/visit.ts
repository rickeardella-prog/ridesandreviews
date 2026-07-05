import { z } from "zod";

export const createVisitSchema = z.object({
  parkId: z.string().uuid(),
  visitedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD"),
  notes: z.string().max(2000).optional(),
  isPublic: z.boolean().optional(),
  rideIds: z.array(z.string().uuid()).max(50).optional(),
});

export type CreateVisitInput = z.infer<typeof createVisitSchema>;
