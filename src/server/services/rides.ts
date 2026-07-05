import { and, avg, count, eq } from "drizzle-orm";
import { db } from "../db/client";
import { parks, rideReviews, rides } from "../db/schema";

export async function listAllRidesForSelector() {
  return db
    .select({ id: rides.id, name: rides.name, parkName: parks.name })
    .from(rides)
    .innerJoin(parks, eq(rides.parkId, parks.id))
    .orderBy(parks.name, rides.name);
}

export async function getRideBySlug(parkSlug: string, rideSlug: string) {
  const [park] = await db
    .select()
    .from(parks)
    .where(eq(parks.slug, parkSlug))
    .limit(1);
  if (!park) return null;

  const [ride] = await db
    .select()
    .from(rides)
    .where(and(eq(rides.parkId, park.id), eq(rides.slug, rideSlug)))
    .limit(1);
  if (!ride) return null;

  const [stats] = await db
    .select({
      avgRating: avg(rideReviews.rating),
      reviewCount: count(rideReviews.id),
    })
    .from(rideReviews)
    .where(eq(rideReviews.rideId, ride.id));

  return {
    ...ride,
    park,
    avgRating: stats?.avgRating ?? null,
    reviewCount: stats?.reviewCount ?? 0,
  };
}
