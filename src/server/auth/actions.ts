"use server";

import { signIn } from "./config";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/parks" });
}
