import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "@/server/auth/session";
import { addListItem, getListById } from "@/server/services/lists";
import { addListItemSchema } from "@/server/validation/list";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/lists/[id]/items">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const list = await getListById(id);
  if (!list) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  if (list.userId !== user.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const input = addListItemSchema.parse(body);
    const item = await addListItem(id, input);
    return NextResponse.json({ item }, { status: 201 });
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
