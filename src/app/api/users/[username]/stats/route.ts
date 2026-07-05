import { NextResponse } from "next/server";
import { getUserStats } from "@/server/services/stats";
import { getPublicProfileByUsername } from "@/server/services/users";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/users/[username]/stats">,
) {
  const { username } = await ctx.params;
  const user = await getPublicProfileByUsername(username);
  if (!user) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  const stats = await getUserStats(user.id);
  return NextResponse.json({ stats });
}
