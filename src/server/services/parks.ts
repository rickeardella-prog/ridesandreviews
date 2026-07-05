import { avg, count, eq } from "drizzle-orm";
import { db } from "../db/client";
import { parkReviews, parks, rideReviews, rides } from "../db/schema";

export async function listParks() {
  return db
    .select({
      id: parks.id,
      slug: parks.slug,
      name: parks.name,
      operator: parks.operator,
      city: parks.city,
      region: parks.region,
      country: parks.country,
      coverImageUrl: parks.coverImageUrl,
      avgRating: avg(parkReviews.rating),
      reviewCount: count(parkReviews.id),
    })
    .from(parks)
    .leftJoin(parkReviews, eq(parkReviews.parkId, parks.id))
    .groupBy(parks.id)
    .orderBy(parks.name);
}

export async function getParkBySlug(slug: string) {
  const [park] = await db
    .select()
    .from(parks)
    .where(eq(parks.slug, slug))
    .limit(1);
  if (!park) return null;

  const parkRides = await db
    .select({
      id: rides.id,
      slug: rides.slug,
      name: rides.name,
      rideType: rides.rideType,
      manufacturer: rides.manufacturer,
      status: rides.status,
      heightFt: rides.heightFt,
      coverImageUrl: rides.coverImageUrl,
      avgRating: avg(rideReviews.rating),
    })
    .from(rides)
    .leftJoin(rideReviews, eq(rideReviews.rideId, rides.id))
    .where(eq(rides.parkId, park.id))
    .groupBy(rides.id)
    .orderBy(rides.name);

  const [stats] = await db
    .select({
      avgRating: avg(parkReviews.rating),
      reviewCount: count(parkReviews.id),
    })
    .from(parkReviews)
    .where(eq(parkReviews.parkId, park.id));

  return {
    ...park,
    rides: parkRides,
    avgRating: stats?.avgRating ?? null,
    reviewCount: stats?.reviewCount ?? 0,
  };
}
