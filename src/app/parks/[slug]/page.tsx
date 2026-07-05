import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-semibold">{park.name}</h1>
      <p className="text-zinc-500">
        {[park.city, park.region, park.country].filter(Boolean).join(", ")}
        {park.openedYear ? ` · Opened ${park.openedYear}` : ""}
      </p>
      {park.description && <p className="mt-4">{park.description}</p>}
      <p className="mt-4 font-medium">
        {park.avgRating ? `★ ${Number(park.avgRating).toFixed(1)}/10` : "No reviews yet"}
        {" · "}
        {reviewCount} review{reviewCount === 1 ? "" : "s"}
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Rides</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {park.rides.map((ride) => (
          <li key={ride.id}>
            <Link
              href={`/parks/${park.slug}/rides/${ride.slug}`}
              className="block rounded-lg border border-zinc-200 p-3 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <span className="font-medium">{ride.name}</span>
              <span className="block text-sm text-zinc-500">
                {ride.rideType.replace(/_/g, " ")}
                {ride.avgRating ? ` · ★ ${Number(ride.avgRating).toFixed(1)}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Reviews</h2>
      {user ? (
        <ReviewForm target={{ parkId: park.id }} />
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
