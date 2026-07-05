import { NextResponse } from "next/server";
import { getParkBySlug } from "@/server/services/parks";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/parks/[slug]">,
) {
  const { slug } = await ctx.params;
  const park = await getParkBySlug(slug);
  if (!park) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ park });
}
