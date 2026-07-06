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
        className="field"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="field"
      />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
