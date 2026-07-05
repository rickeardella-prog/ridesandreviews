import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { createVisit } from "@/server/services/visits";
import { createVisitSchema } from "@/server/validation/visit";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = createVisitSchema.parse(body);
    const visit = await createVisit(user.id, input);
    return NextResponse.json({ visit }, { status: 201 });
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
