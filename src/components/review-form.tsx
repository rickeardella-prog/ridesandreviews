"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost } from "@/lib/api-client";

type Target = { parkId: string } | { rideId: string };

export function ReviewForm({ target }: { target: Target }) {
  const router = useRouter();
  const [rating, setRating] = useState(8);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await apiPost("/api/reviews", { ...target, rating, body: body || undefined });
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-4 flex flex-col gap-3 p-4">
      <label className="text-sm font-medium">
        Rating: <span className="text-accent font-bold">{rating}</span>/10
        <input
          type="range"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-1 w-full accent-accent"
        />
      </label>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Airtime? Headbanging? Tell the thoosies (optional)"
        rows={3}
        className="field"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary self-start">
        {pending ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
