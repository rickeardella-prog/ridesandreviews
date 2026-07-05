import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { followUser, unfollowUser } from "@/server/services/follows";
import { followSchema } from "@/server/validation/follow";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = followSchema.parse(body);
    await followUser(user.id, input.followeeId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: err.issues },
        { status: 400 },
      );
    }
    if (err instanceof Error && err.message === "CANNOT_FOLLOW_SELF") {
      return NextResponse.json({ error: "CANNOT_FOLLOW_SELF" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = followSchema.parse(body);
    await unfollowUser(user.id, input.followeeId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: err.issues },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
