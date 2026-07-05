"use server";

import { signIn } from "@/server/auth/config";
import { createUserWithPassword } from "@/server/services/users";
import { signupSchema } from "@/server/validation/auth";

export async function signupAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = signupSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await createUserWithPassword(parsed.data);
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return { error: "Email already in use" };
    }
    if (err instanceof Error && err.message === "USERNAME_TAKEN") {
      return { error: "Username already taken" };
    }
    throw err;
  }

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/parks",
  });
}
