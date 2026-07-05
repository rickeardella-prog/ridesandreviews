import { and, eq } from "drizzle-orm";
import { db } from "../db/client";
import { follows } from "../db/schema";

export async function followUser(followerId: string, followeeId: string) {
  if (followerId === followeeId) throw new Error("CANNOT_FOLLOW_SELF");
  await db.insert(follows).values({ followerId, followeeId }).onConflictDoNothing();
}

export async function unfollowUser(followerId: string, followeeId: string) {
  await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
}

export async function isFollowing(followerId: string, followeeId: string) {
  const [row] = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)))
    .limit(1);
  return !!row;
}

export async function getFollowedUserIds(userId: string) {
  const rows = await db
    .select({ id: follows.followeeId })
    .from(follows)
    .where(eq(follows.followerId, userId));
  return rows.map((r) => r.id);
}
