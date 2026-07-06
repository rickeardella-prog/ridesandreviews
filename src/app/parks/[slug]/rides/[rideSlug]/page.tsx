import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
import { slugGradient } from "@/lib/palette";
import { getCurrentUser } from "@/server/auth/session";
import { listRideReviews } from "@/server/services/reviews";
import { getRideBySlug } from "@/server/services/rides";

export default async function RideDetailPage({
  params,
}: {
  params: Promise<{ slug: string; rideSlug: string }>;
}) {
  const { slug, rideSlug } = await params;
  const ride = await getRideBySlug(slug, rideSlug);
  if (!ride) notFound();

  const [reviews, user] = await Promise.all([
    listRideReviews(ride.id),
    getCurrentUser(),
  ]);
  const reviewCount = Number(ride.reviewCount);

  return (
    <div>
      <div
        className="border-b border-line"
        style={{ background: slugGradient(ride.slug) }}
      >
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-6">
          <Link
            href={`/parks/${ride.park.slug}`}
            className="text-sm text-ink/70 transition hover:text-ink"
          >
            ← {ride.park.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight">{ride.name}</h1>
            <div className="flex items-center gap-2">
              {ride.avgRating && (
                <span className="rating-badge text-lg">
                  ★ {Number(ride.avgRating).toFixed(1)}
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
          <span className="chip capitalize">{ride.rideType.replace(/_/g, " ")}</span>
          {ride.manufacturer && <span className="chip">{ride.manufacturer}</span>}
          {ride.openedYear && <span className="chip">Opened {ride.openedYear}</span>}
          {ride.heightFt && (
            <span className="chip">{Number(ride.heightFt)} ft</span>
          )}
          <span className="chip capitalize">{ride.status.replace(/_/g, " ")}</span>
        </div>
        {ride.description && (
          <p className="mt-4 max-w-2xl text-mut">{ride.description}</p>
        )}

        <h2 className="eyebrow mt-10 mb-3">Reviews</h2>
        {user ? (
          <ReviewForm target={{ rideId: ride.id }} />
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
