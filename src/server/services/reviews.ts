import { desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { parkReviews, rideReviews, users } from "../db/schema";
import type { CreateReviewInput } from "../validation/review";

export async function createReview(userId: string, input: CreateReviewInput) {
  if ("parkId" in input) {
    const [review] = await db
      .insert(parkReviews)
      .values({ userId, parkId: input.parkId, rating: input.rating, body: input.body })
      .returning();
    return review;
  }

  const [review] = await db
    .insert(rideReviews)
    .values({ userId, rideId: input.rideId, rating: input.rating, body: input.body })
    .returning();
  return review;
}

export async function listParkReviews(parkId: string) {
  return db
    .select({
      id: parkReviews.id,
      rating: parkReviews.rating,
      body: parkReviews.body,
      createdAt: parkReviews.createdAt,
      username: users.username,
      displayName: users.name,
      avatarUrl: users.image,
    })
    .from(parkReviews)
    .innerJoin(users, eq(parkReviews.userId, users.id))
    .where(eq(parkReviews.parkId, parkId))
    .orderBy(desc(parkReviews.createdAt));
}

export async function listRideReviews(rideId: string) {
  return db
    .select({
      id: rideReviews.id,
      rating: rideReviews.rating,
      body: rideReviews.body,
      createdAt: rideReviews.createdAt,
      username: users.username,
      displayName: users.name,
      avatarUrl: users.image,
    })
    .from(rideReviews)
    .innerJoin(users, eq(rideReviews.userId, users.id))
    .where(eq(rideReviews.rideId, rideId))
    .orderBy(desc(rideReviews.createdAt));
}
