import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { getFeed } from "@/server/services/feed";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }
  const feed = await getFeed(user.id);
  return NextResponse.json({ feed });
}
