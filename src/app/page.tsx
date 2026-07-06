import Link from "next/link";
import { slugGradient } from "@/lib/palette";
import { getCurrentUser } from "@/server/auth/session";
import { listParks } from "@/server/services/parks";

export default async function Home() {
  const [parks, user] = await Promise.all([listParks(), getCurrentUser()]);
  const featured = [...parks]
    .sort((a, b) => Number(b.avgRating ?? 0) - Number(a.avgRating ?? 0))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="eyebrow">For thoosies, by thoosies</p>
        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          Every credit.
          <br />
          Every park. <span className="text-accent">Every drop.</span>
        </h1>
        <p className="max-w-xl text-lg text-mut">
          ParkLog is the social network for coaster enthusiasts. Rate rides,
          log park visits, follow other riders, and rank your favorites.
        </p>
        <div className="flex gap-3">
          {user ? (
            <Link href="/visits/new" className="btn-primary">
              + Log a visit
            </Link>
          ) : (
            <Link href="/signup" className="btn-primary">
              Get started — it&apos;s free
            </Link>
          )}
          <Link href="/parks" className="btn-secondary">
            Browse parks
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="eyebrow">Popular parks</h2>
          <Link href="/parks" className="text-sm text-mut transition hover:text-ink">
            See all →
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((park) => (
            <li key={park.id}>
              <Link href={`/parks/${park.slug}`} className="card block overflow-hidden">
                <div
                  className="flex h-28 items-end p-2"
                  style={{ background: slugGradient(park.slug) }}
                >
                  {park.avgRating && (
                    <span className="rating-badge">
                      ★ {Number(park.avgRating).toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold">{park.name}</h3>
                  <p className="truncate text-xs text-faint">
                    {[park.city, park.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
