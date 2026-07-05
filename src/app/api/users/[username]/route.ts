import { NextResponse } from "next/server";
import { getPublicProfileByUsername } from "@/server/services/users";
import { listUserDiary } from "@/server/services/visits";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/users/[username]">,
) {
  const { username } = await ctx.params;
  const user = await getPublicProfileByUsername(username);
  if (!user) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  const diary = await listUserDiary(user.id);
  return NextResponse.json({ user, diary });
}
