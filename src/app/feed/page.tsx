import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getFeed } from "@/server/services/feed";

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const feed = await getFeed(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="eyebrow mb-1">What your people are riding</p>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Feed</h1>
      <ul className="flex flex-col gap-3">
        {feed.map((item) => (
          <li key={`${item.type}-${item.id}`} className="card p-4">
            <FeedItem item={item} />
          </li>
        ))}
        {feed.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-mut">
              Nothing here yet. Follow some riders from their profile pages to
              see their reviews and visits.
            </p>
            <Link href="/parks" className="btn-secondary mt-4">
              Browse parks
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
}

type FeedEntry = Awaited<ReturnType<typeof getFeed>>[number];

function FeedItem({ item }: { item: FeedEntry }) {
  if (item.type === "park_review") {
    return (
      <div>
        <p className="text-sm">
          <Link href={`/u/${item.username}`} className="font-semibold hover:text-accent">
            @{item.username}
          </Link>{" "}
          <span className="text-mut">rated</span>{" "}
          <Link href={`/parks/${item.parkSlug}`} className="font-semibold hover:text-accent">
            {item.parkName}
          </Link>{" "}
          <span className="rating-badge ml-1">★ {item.rating}</span>
        </p>
        {item.body && <p className="mt-2 text-sm text-mut">{item.body}</p>}
      </div>
    );
  }

  if (item.type === "ride_review") {
    return (
      <div>
        <p className="text-sm">
          <Link href={`/u/${item.username}`} className="font-semibold hover:text-accent">
            @{item.username}
          </Link>{" "}
          <span className="text-mut">rated</span>{" "}
          <Link
            href={`/parks/${item.parkSlug}/rides/${item.rideSlug}`}
            className="font-semibold hover:text-accent"
          >
            {item.rideName}
          </Link>{" "}
          <span className="rating-badge ml-1">★ {item.rating}</span>
        </p>
        {item.body && <p className="mt-2 text-sm text-mut">{item.body}</p>}
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm">
        <Link href={`/u/${item.username}`} className="font-semibold hover:text-accent">
          @{item.username}
        </Link>{" "}
        <span className="text-mut">visited</span>{" "}
        <Link href={`/parks/${item.parkSlug}`} className="font-semibold hover:text-accent">
          {item.parkName}
        </Link>{" "}
        <span className="text-xs text-faint">{item.visitedOn}</span>
      </p>
      {item.notes && <p className="mt-2 text-sm text-mut">{item.notes}</p>}
    </div>
  );
}
