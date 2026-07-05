import { NextResponse } from "next/server";
import { getListById } from "@/server/services/lists";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/lists/[id]">,
) {
  const { id } = await ctx.params;
  const list = await getListById(id);
  if (!list) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ list });
}
