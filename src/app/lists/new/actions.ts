"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { createList } from "@/server/services/lists";
import { createListSchema } from "@/server/validation/list";

export async function createListAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const user = await requireUser();

  const parsed = createListSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    isRanked: formData.get("isRanked") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const list = await createList(user.id, parsed.data);
  redirect(`/lists/${list.id}`);
}
