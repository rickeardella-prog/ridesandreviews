"use client";

import { useActionState } from "react";
import { signupAction } from "./actions";

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input
        name="username"
        placeholder="Username"
        required
        pattern="[a-zA-Z0-9_]{3,24}"
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      <input
        name="displayName"
        placeholder="Display name"
        required
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      <input
        name="password"
        type="password"
        placeholder="Password (min 8 characters)"
        required
        minLength={8}
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-zinc-900 px-3 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
