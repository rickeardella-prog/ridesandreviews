import Link from "next/link";
import { listParks } from "@/server/services/parks";

export default async function ParksPage() {
  const parks = await listParks();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Parks</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {parks.map((park) => {
          const reviewCount = Number(park.reviewCount);
          return (
            <li
              key={park.id}
              className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <Link href={`/parks/${park.slug}`} className="block">
                <h2 className="text-lg font-medium">{park.name}</h2>
                <p className="text-sm text-zinc-500">
                  {[park.city, park.region, park.country].filter(Boolean).join(", ")}
                </p>
                <p className="mt-2 text-sm">
                  {park.avgRating ? `★ ${Number(park.avgRating).toFixed(1)}/10` : "No reviews yet"}
                  {" · "}
                  {reviewCount} review{reviewCount === 1 ? "" : "s"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
