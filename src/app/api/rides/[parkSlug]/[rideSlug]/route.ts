import { NextResponse } from "next/server";
import { getRideBySlug } from "@/server/services/rides";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/rides/[parkSlug]/[rideSlug]">,
) {
  const { parkSlug, rideSlug } = await ctx.params;
  const ride = await getRideBySlug(parkSlug, rideSlug);
  if (!ride) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ ride });
}
