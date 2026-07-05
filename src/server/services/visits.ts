import { count, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { parks, rideLogs, visits } from "../db/schema";
import type { CreateVisitInput } from "../validation/visit";

export async function createVisit(userId: string, input: CreateVisitInput) {
  const [visit] = await db
    .insert(visits)
    .values({
      userId,
      parkId: input.parkId,
      visitedOn: input.visitedOn,
      notes: input.notes,
      isPublic: input.isPublic ?? true,
    })
    .returning();

  if (input.rideIds?.length) {
    await db
      .insert(rideLogs)
      .values(input.rideIds.map((rideId) => ({ visitId: visit.id, rideId })));
  }

  return visit;
}

export async function listUserDiary(userId: string) {
  return db
    .select({
      id: visits.id,
      visitedOn: visits.visitedOn,
      notes: visits.notes,
      parkSlug: parks.slug,
      parkName: parks.name,
      rideLogCount: count(rideLogs.id),
    })
    .from(visits)
    .innerJoin(parks, eq(visits.parkId, parks.id))
    .leftJoin(rideLogs, eq(rideLogs.visitId, visits.id))
    .where(eq(visits.userId, userId))
    .groupBy(visits.id, parks.id)
    .orderBy(desc(visits.visitedOn), desc(visits.createdAt));
}
