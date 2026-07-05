import { NextResponse } from "next/server";
import { listParks } from "@/server/services/parks";

export async function GET() {
  const parks = await listParks();
  return NextResponse.json({ parks });
}
