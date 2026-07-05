import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createUserWithPassword } from "@/server/services/users";
import { signupSchema } from "@/server/validation/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = signupSchema.parse(body);
    const user = await createUserWithPassword(input);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: err.issues },
        { status: 400 },
      );
    }
    if (
      err instanceof Error &&
      (err.message === "EMAIL_TAKEN" || err.message === "USERNAME_TAKEN")
    ) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
