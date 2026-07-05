import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href={`/parks/${ride.park.slug}`} className="text-sm text-zinc-500 underline">
        ← {ride.park.name}
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">{ride.name}</h1>
      <p className="text-zinc-500">
        {ride.rideType.replace(/_/g, " ")}
        {ride.manufacturer ? ` · ${ride.manufacturer}` : ""}
        {ride.openedYear ? ` · Opened ${ride.openedYear}` : ""}
        {ride.heightFt ? ` · ${ride.heightFt} ft` : ""}
      </p>
      {ride.description && <p className="mt-4">{ride.description}</p>}
      <p className="mt-4 font-medium">
        {ride.avgRating ? `★ ${Number(ride.avgRating).toFixed(1)}/10` : "No reviews yet"}
        {" · "}
        {reviewCount} review{reviewCount === 1 ? "" : "s"}
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Reviews</h2>
      {user ? (
        <ReviewForm target={{ rideId: ride.id }} />
      ) : (
        <p className="mb-4 text-sm text-zinc-500">
          <Link href="/login" className="underline">
            Log in
          </Link>{" "}
          to leave a review.
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {reviews.map((review) => (
          <li key={review.id} className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">@{review.username}</span>
              <span className="text-zinc-500">★ {review.rating}/10</span>
            </div>
            {review.body && <p className="mt-1">{review.body}</p>}
          </li>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-zinc-500">No reviews yet — be the first.</p>
        )}
      </ul>
    </div>
  );
}
