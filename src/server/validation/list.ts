import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  isPublic: z.boolean().optional(),
  isRanked: z.boolean().optional(),
});

export type CreateListInput = z.infer<typeof createListSchema>;

const noteField = z.string().max(500).optional();

export const addListItemSchema = z.union([
  z.object({ parkId: z.string().uuid(), note: noteField }),
  z.object({ rideId: z.string().uuid(), note: noteField }),
]);

export type AddListItemInput = z.infer<typeof addListItemSchema>;
