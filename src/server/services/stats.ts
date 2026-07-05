import { count, eq, sql } from "drizzle-orm";
import { db } from "../db/client";
import { parkReviews, rideLogs, rideReviews, visits } from "../db/schema";

export async function getUserStats(userId: string) {
  const [visitStats] = await db
    .select({ parksVisited: sql<number>`count(distinct ${visits.parkId})` })
    .from(visits)
    .where(eq(visits.userId, userId));

  const [rideLogStats] = await db
    .select({ ridesRidden: count(rideLogs.id) })
    .from(rideLogs)
    .innerJoin(visits, eq(rideLogs.visitId, visits.id))
    .where(eq(visits.userId, userId));

  const [parkReviewStats] = await db
    .select({
      sum: sql<string>`coalesce(sum(${parkReviews.rating}), 0)`,
      count: count(parkReviews.id),
    })
    .from(parkReviews)
    .where(eq(parkReviews.userId, userId));

  const [rideReviewStats] = await db
    .select({
      sum: sql<string>`coalesce(sum(${rideReviews.rating}), 0)`,
      count: count(rideReviews.id),
    })
    .from(rideReviews)
    .where(eq(rideReviews.userId, userId));

  const reviewCount =
    Number(parkReviewStats?.count ?? 0) + Number(rideReviewStats?.count ?? 0);
  const ratingSum =
    Number(parkReviewStats?.sum ?? 0) + Number(rideReviewStats?.sum ?? 0);

  return {
    parksVisited: Number(visitStats?.parksVisited ?? 0),
    ridesRidden: Number(rideLogStats?.ridesRidden ?? 0),
    reviewCount,
    avgRatingGiven: reviewCount > 0 ? ratingSum / reviewCount : null,
  };
}
