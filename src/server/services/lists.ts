import { asc, desc, eq, max } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../db/client";
import { listItems, lists, parks, rides, users } from "../db/schema";
import type { AddListItemInput, CreateListInput } from "../validation/list";

const rideParks = alias(parks, "ride_parks");

export async function createList(userId: string, input: CreateListInput) {
  const [list] = await db
    .insert(lists)
    .values({
      userId,
      title: input.title,
      description: input.description,
      isPublic: input.isPublic ?? true,
      isRanked: input.isRanked ?? true,
    })
    .returning();
  return list;
}

export async function listUserLists(userId: string) {
  return db
    .select()
    .from(lists)
    .where(eq(lists.userId, userId))
    .orderBy(desc(lists.createdAt));
}

export async function getListById(id: string) {
  const [list] = await db
    .select({
      id: lists.id,
      title: lists.title,
      description: lists.description,
      isPublic: lists.isPublic,
      isRanked: lists.isRanked,
      userId: lists.userId,
      username: users.username,
      createdAt: lists.createdAt,
    })
    .from(lists)
    .innerJoin(users, eq(lists.userId, users.id))
    .where(eq(lists.id, id))
    .limit(1);
  if (!list) return null;

  const items = await db
    .select({
      id: listItems.id,
      position: listItems.position,
      note: listItems.note,
      parkSlug: parks.slug,
      parkName: parks.name,
      rideSlug: rides.slug,
      rideName: rides.name,
      rideParkSlug: rideParks.slug,
    })
    .from(listItems)
    .leftJoin(parks, eq(listItems.parkId, parks.id))
    .leftJoin(rides, eq(listItems.rideId, rides.id))
    .leftJoin(rideParks, eq(rides.parkId, rideParks.id))
    .where(eq(listItems.listId, id))
    .orderBy(asc(listItems.position));

  return { ...list, items };
}

export async function addListItem(listId: string, input: AddListItemInput) {
  const [{ maxPosition }] = await db
    .select({ maxPosition: max(listItems.position) })
    .from(listItems)
    .where(eq(listItems.listId, listId));

  const position = (maxPosition ?? 0) + 1;

  const [item] = await db
    .insert(listItems)
    .values({
      listId,
      parkId: "parkId" in input ? input.parkId : null,
      rideId: "rideId" in input ? input.rideId : null,
      note: input.note,
      position,
    })
    .returning();
  return item;
}
