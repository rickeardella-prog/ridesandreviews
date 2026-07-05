import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";
import type { SignupInput } from "../validation/auth";

export async function createUserWithPassword(input: SignupInput) {
  const email = input.email.toLowerCase();

  const [existingEmail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingEmail) throw new Error("EMAIL_TAKEN");

  const [existingUsername] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, input.username))
    .limit(1);
  if (existingUsername) throw new Error("USERNAME_TAKEN");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const [created] = await db
    .insert(users)
    .values({
      username: input.username,
      name: input.displayName,
      email,
      passwordHash,
    })
    .returning({
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
    });

  return created;
}

export async function getPublicProfileByUsername(username: string) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      image: users.image,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user ?? null;
}
