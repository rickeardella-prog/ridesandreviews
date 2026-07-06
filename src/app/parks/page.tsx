import Link from "next/link";
import { slugGradient } from "@/lib/palette";
import { listParks } from "@/server/services/parks";

export default async function ParksPage() {
  const parks = await listParks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="eyebrow mb-1">The catalog</p>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Parks</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parks.map((park) => {
          const reviewCount = Number(park.reviewCount);
          return (
            <li key={park.id}>
              <Link href={`/parks/${park.slug}`} className="card block overflow-hidden">
                <div
                  className="flex h-32 items-end justify-between p-3"
                  style={{ background: slugGradient(park.slug) }}
                >
                  {park.avgRating ? (
                    <span className="rating-badge">
                      ★ {Number(park.avgRating).toFixed(1)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {park.operator && (
                    <span className="chip max-w-[60%] truncate">{park.operator}</span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{park.name}</h2>
                  <p className="text-sm text-mut">
                    {[park.city, park.region, park.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="mt-2 text-xs text-faint">
                    {reviewCount > 0
                      ? `${reviewCount} review${reviewCount === 1 ? "" : "s"}`
                      : "No reviews yet — be the first"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
