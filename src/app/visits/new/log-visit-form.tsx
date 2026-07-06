"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiPost } from "@/lib/api-client";

type Park = { id: string; slug: string; name: string };
type Ride = { id: string; name: string };

export function LogVisitForm({
  parks,
  username,
}: {
  parks: Park[];
  username: string;
}) {
  const router = useRouter();
  const [parkId, setParkId] = useState(parks[0]?.id ?? "");
  const [visitedOn, setVisitedOn] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRideIds, setSelectedRideIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRides(parkId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadRides(id: string) {
    const park = parks.find((p) => p.id === id);
    if (!park) return;
    const res = await fetch(`/api/parks/${park.slug}`);
    const data = await res.json();
    setRides(data.park?.rides ?? []);
  }

  function handleParkChange(newParkId: string) {
    setParkId(newParkId);
    setSelectedRideIds([]);
    loadRides(newParkId);
  }

  function toggleRide(rideId: string) {
    setSelectedRideIds((prev) =>
      prev.includes(rideId) ? prev.filter((id) => id !== rideId) : [...prev, rideId],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await apiPost("/api/visits", {
        parkId,
        visitedOn,
        notes: notes || undefined,
        rideIds: selectedRideIds,
      });
      router.push(`/u/${username}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Park
        <select
          value={parkId}
          onChange={(e) => handleParkChange(e.target.value)}
          className="field"
        >
          {parks.map((park) => (
            <option key={park.id} value={park.id}>
              {park.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Date
        <input
          type="date"
          value={visitedOn}
          onChange={(e) => setVisitedOn(e.target.value)}
          required
          className="field"
        />
      </label>

      {rides.length > 0 && (
        <fieldset className="flex flex-col gap-1.5 text-sm">
          <legend className="mb-2 font-medium">
            Credits earned <span className="text-faint">(rides you rode)</span>
          </legend>
          {rides.map((ride) => (
            <label
              key={ride.id}
              className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 transition hover:border-faint"
            >
              <input
                type="checkbox"
                checked={selectedRideIds.includes(ride.id)}
                onChange={() => toggleRide(ride.id)}
                className="accent-accent"
              />
              {ride.name}
            </label>
          ))}
        </fieldset>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Crowds, weather, ERT, one-train ops..."
          className="field"
        />
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={pending || !parkId}
        className="btn-primary self-start"
      >
        {pending ? "Saving..." : "Log visit"}
      </button>
    </form>
  );
}
