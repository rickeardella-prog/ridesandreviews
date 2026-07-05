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
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isRanked" defaultChecked />
        Ranked list (ordered, e.g. #1 to #10)
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Creating..." : "Create list"}
      </button>
    </form>
  );
}
