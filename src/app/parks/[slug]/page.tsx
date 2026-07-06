import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
import { slugGradient } from "@/lib/palette";
import { getCurrentUser } from "@/server/auth/session";
import { getParkBySlug } from "@/server/services/parks";
import { listParkReviews } from "@/server/services/reviews";

export default async function ParkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const park = await getParkBySlug(slug);
  if (!park) notFound();

  const [reviews, user] = await Promise.all([
    listParkReviews(park.id),
    getCurrentUser(),
  ]);
  const reviewCount = Number(park.reviewCount);

  return (
    <div>
      <div
        className="border-b border-line"
        style={{ background: slugGradient(park.slug) }}
      >
        <div className="mx-auto max-w-4xl px-4 pt-20 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {park.name}
              </h1>
              <p className="mt-1 text-sm text-ink/80">
                {[park.city, park.region, park.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {park.avgRating && (
                <span className="rating-badge text-lg">
                  ★ {Number(park.avgRating).toFixed(1)}
                  <span className="text-xs font-normal text-mut">/10</span>
                </span>
              )}
              <span className="chip">
                {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {park.operator && <span className="chip">{park.operator}</span>}
          {park.openedYear && <span className="chip">Opened {park.openedYear}</span>}
          <span className="chip capitalize">{park.status.replace(/_/g, " ")}</span>
        </div>
        {park.description && (
          <p className="mt-4 max-w-2xl text-mut">{park.description}</p>
        )}

        <h2 className="eyebrow mt-10 mb-3">
          Rides <span className="text-faint">({park.rides.length})</span>
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {park.rides.map((ride) => (
            <li key={ride.id}>
              <Link
                href={`/parks/${park.slug}/rides/${ride.slug}`}
                className="card flex items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <span className="block truncate font-semibold">{ride.name}</span>
                  <span className="block text-xs text-faint capitalize">
                    {ride.rideType.replace(/_/g, " ")}
                  </span>
                </div>
                {ride.avgRating && (
                  <span className="rating-badge shrink-0">
                    ★ {Number(ride.avgRating).toFixed(1)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="eyebrow mt-10 mb-3">Reviews</h2>
        {user ? (
          <ReviewForm target={{ parkId: park.id }} />
        ) : (
          <p className="mb-4 text-sm text-mut">
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <li key={review.id} className="card p-4">
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href={`/u/${review.username}`}
                  className="font-semibold hover:text-accent"
                >
                  @{review.username}
                </Link>
                <span className="rating-badge">★ {review.rating}</span>
              </div>
              {review.body && <p className="mt-2 text-mut">{review.body}</p>}
            </li>
          ))}
          {reviews.length === 0 && (
            <p className="text-sm text-faint">No reviews yet — be the first.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
