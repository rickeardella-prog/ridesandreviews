"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
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
        placeholder="Password"
        required
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-zinc-900 px-3 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
