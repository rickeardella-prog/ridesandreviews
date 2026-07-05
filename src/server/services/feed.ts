import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { parkReviews, parks, rideReviews, rides, users, visits } from "../db/schema";
import { getFollowedUserIds } from "./follows";

export async function getFeed(userId: string, limit = 30) {
  const followedIds = await getFollowedUserIds(userId);
  if (followedIds.length === 0) return [];

  const [parkReviewRows, rideReviewRows, visitRows] = await Promise.all([
    db
      .select({
        id: parkReviews.id,
        createdAt: parkReviews.createdAt,
        rating: parkReviews.rating,
        body: parkReviews.body,
        username: users.username,
        parkSlug: parks.slug,
        parkName: parks.name,
      })
      .from(parkReviews)
      .innerJoin(users, eq(parkReviews.userId, users.id))
      .innerJoin(parks, eq(parkReviews.parkId, parks.id))
      .where(and(inArray(parkReviews.userId, followedIds), eq(parkReviews.isPublic, true)))
      .orderBy(desc(parkReviews.createdAt))
      .limit(limit),

    db
      .select({
        id: rideReviews.id,
        createdAt: rideReviews.createdAt,
        rating: rideReviews.rating,
        body: rideReviews.body,
        username: users.username,
        rideName: rides.name,
        rideSlug: rides.slug,
        parkSlug: parks.slug,
      })
      .from(rideReviews)
      .innerJoin(users, eq(rideReviews.userId, users.id))
      .innerJoin(rides, eq(rideReviews.rideId, rides.id))
      .innerJoin(parks, eq(rides.parkId, parks.id))
      .where(and(inArray(rideReviews.userId, followedIds), eq(rideReviews.isPublic, true)))
      .orderBy(desc(rideReviews.createdAt))
      .limit(limit),

    db
      .select({
        id: visits.id,
        createdAt: visits.createdAt,
        visitedOn: visits.visitedOn,
        notes: visits.notes,
        username: users.username,
        parkSlug: parks.slug,
        parkName: parks.name,
      })
      .from(visits)
      .innerJoin(users, eq(visits.userId, users.id))
      .innerJoin(parks, eq(visits.parkId, parks.id))
      .where(and(inArray(visits.userId, followedIds), eq(visits.isPublic, true)))
      .orderBy(desc(visits.createdAt))
      .limit(limit),
  ]);

  const items = [
    ...parkReviewRows.map((r) => ({ type: "park_review" as const, ...r })),
    ...rideReviewRows.map((r) => ({ type: "ride_review" as const, ...r })),
    ...visitRows.map((r) => ({ type: "visit" as const, ...r })),
  ];

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return items.slice(0, limit);
}
