import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowButton } from "@/components/follow-button";
import { getCurrentUser } from "@/server/auth/session";
import { isFollowing } from "@/server/services/follows";
import { getUserStats } from "@/server/services/stats";
import { getPublicProfileByUsername } from "@/server/services/users";
import { listUserDiary } from "@/server/services/visits";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getPublicProfileByUsername(username);
  if (!user) notFound();

  const currentUser = await getCurrentUser();
  const [diary, stats, viewerIsFollowing] = await Promise.all([
    listUserDiary(user.id),
    getUserStats(user.id),
    currentUser && currentUser.id !== user.id
      ? isFollowing(currentUser.id, user.id)
      : Promise.resolve(false),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">@{user.username}</h1>
          <p className="text-zinc-500">{user.name}</p>
        </div>
        {currentUser && currentUser.id !== user.id && (
          <FollowButton followeeId={user.id} initiallyFollowing={viewerIsFollowing} />
        )}
      </div>
      {user.bio && <p className="mt-2">{user.bio}</p>}

      <div className="mt-6 flex gap-8 text-sm">
        <div>
          <span className="block text-xl font-semibold">{stats.parksVisited}</span>
          <span className="text-zinc-500">parks visited</span>
        </div>
        <div>
          <span className="block text-xl font-semibold">{stats.ridesRidden}</span>
          <span className="text-zinc-500">rides ridden</span>
        </div>
        <div>
          <span className="block text-xl font-semibold">
            {stats.avgRatingGiven ? stats.avgRatingGiven.toFixed(1) : "—"}
          </span>
          <span className="text-zinc-500">avg rating given</span>
        </div>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold">Diary</h2>
      <ul className="flex flex-col gap-3">
        {diary.map((entry) => {
          const rideLogCount = Number(entry.rideLogCount);
          return (
            <li
              key={entry.id}
              className="border-t border-zinc-200 pt-3 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <Link href={`/parks/${entry.parkSlug}`} className="font-medium underline">
                  {entry.parkName}
                </Link>
                <span className="text-sm text-zinc-500">{entry.visitedOn}</span>
              </div>
              {rideLogCount > 0 && (
                <p className="text-sm text-zinc-500">
                  {rideLogCount} ride{rideLogCount === 1 ? "" : "s"} logged
                </p>
              )}
              {entry.notes && <p className="mt-1 text-sm">{entry.notes}</p>}
            </li>
          );
        })}
        {diary.length === 0 && (
          <p className="text-sm text-zinc-500">No visits logged yet.</p>
        )}
      </ul>
    </div>
  );
}
