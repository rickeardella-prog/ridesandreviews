import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getFeed } from "@/server/services/feed";

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const feed = await getFeed(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Feed</h1>
      <ul className="flex flex-col gap-4">
        {feed.map((item) => (
          <li key={`${item.type}-${item.id}`} className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <FeedItem item={item} />
          </li>
        ))}
        {feed.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nothing here yet. Follow some riders from their profile pages to see
            their reviews and visits.
          </p>
        )}
      </ul>
    </div>
  );
}

type FeedEntry = Awaited<ReturnType<typeof getFeed>>[number];

function FeedItem({ item }: { item: FeedEntry }) {
  if (item.type === "park_review") {
    return (
      <p>
        <Link href={`/u/${item.username}`} className="font-medium underline">
          @{item.username}
        </Link>{" "}
        rated{" "}
        <Link href={`/parks/${item.parkSlug}`} className="underline">
          {item.parkName}
        </Link>{" "}
        <span className="text-zinc-500">★ {item.rating}/10</span>
        {item.body && <span className="block mt-1 text-sm">{item.body}</span>}
      </p>
    );
  }

  if (item.type === "ride_review") {
    return (
      <p>
        <Link href={`/u/${item.username}`} className="font-medium underline">
          @{item.username}
        </Link>{" "}
        rated{" "}
        <Link href={`/parks/${item.parkSlug}/rides/${item.rideSlug}`} className="underline">
          {item.rideName}
        </Link>{" "}
        <span className="text-zinc-500">★ {item.rating}/10</span>
        {item.body && <span className="block mt-1 text-sm">{item.body}</span>}
      </p>
    );
  }

  return (
    <p>
      <Link href={`/u/${item.username}`} className="font-medium underline">
        @{item.username}
      </Link>{" "}
      visited{" "}
      <Link href={`/parks/${item.parkSlug}`} className="underline">
        {item.parkName}
      </Link>{" "}
      <span className="text-zinc-500">{item.visitedOn}</span>
      {item.notes && <span className="block mt-1 text-sm">{item.notes}</span>}
    </p>
  );
}
