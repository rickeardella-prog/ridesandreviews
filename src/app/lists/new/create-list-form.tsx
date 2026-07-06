"use client";

import { useActionState } from "react";
import { createListAction } from "./actions";

export function CreateListForm() {
  const [state, action, pending] = useActionState(createListAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input
        name="title"
        placeholder="List title, e.g. Best coasters 2026"
        required
        maxLength={120}
        className="field"
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        className="field"
      />
      <label className="flex items-center gap-2 text-sm text-mut">
        <input type="checkbox" name="isRanked" defaultChecked className="accent-accent" />
        Ranked list (ordered, e.g. #1 to #10)
      </label>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary self-start">
        {pending ? "Creating..." : "Create list"}
      </button>
    </form>
  );
}
