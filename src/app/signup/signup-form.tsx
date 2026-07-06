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
        className="field"
      />
      <input
        name="displayName"
        placeholder="Display name"
        required
        className="field"
      />
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
        placeholder="Password (min 8 characters)"
        required
        minLength={8}
        className="field"
      />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
