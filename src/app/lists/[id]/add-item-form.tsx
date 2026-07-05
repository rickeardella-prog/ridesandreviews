"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost } from "@/lib/api-client";

type Park = { id: string; name: string };
type Ride = { id: string; name: string; parkName: string };

export function AddItemForm({
  listId,
  parks,
  rides,
}: {
  listId: string;
  parks: Park[];
  rides: Ride[];
}) {
  const router = useRouter();
  const options = [
    ...parks.map((p) => ({ value: `park:${p.id}`, label: `Park: ${p.name}` })),
    ...rides.map((r) => ({ value: `ride:${r.id}`, label: `Ride: ${r.name} (${r.parkName})` })),
  ];
  const [selected, setSelected] = useState(options[0]?.value ?? "");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setPending(true);
    setError(null);
    const [type, id] = selected.split(":");
    try {
      await apiPost(`/api/lists/${listId}/items`, {
        [type === "park" ? "parkId" : "rideId"]: id,
        note: note || undefined,
      });
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note (optional)"
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending || !selected}
        className="self-start rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "Adding..." : "Add to list"}
      </button>
    </form>
  );
}
