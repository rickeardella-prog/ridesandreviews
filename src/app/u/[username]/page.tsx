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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-raised text-2xl font-bold text-accent">
            {user.username.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">@{user.username}</h1>
            <p className="text-mut">{user.name}</p>
          </div>
        </div>
        {currentUser && currentUser.id !== user.id && (
          <FollowButton
            followeeId={user.id}
            initiallyFollowing={viewerIsFollowing}
          />
        )}
      </div>
      {user.bio && <p className="mt-4 text-mut">{user.bio}</p>}

      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <span className="block text-2xl font-extrabold text-accent">
            {stats.parksVisited}
          </span>
          <span className="text-xs text-faint uppercase tracking-wider">
            parks visited
          </span>
        </div>
        <div className="card p-4 text-center">
          <span className="block text-2xl font-extrabold text-accent">
            {stats.ridesRidden}
          </span>
          <span className="text-xs text-faint uppercase tracking-wider">
            credits
          </span>
        </div>
        <div className="card p-4 text-center">
          <span className="block text-2xl font-extrabold text-accent">
            {stats.avgRatingGiven ? stats.avgRatingGiven.toFixed(1) : "—"}
          </span>
          <span className="text-xs text-faint uppercase tracking-wider">
            avg rating
          </span>
        </div>
      </div>

      <h2 className="eyebrow mt-10 mb-3">Diary</h2>
      <ul className="flex flex-col gap-3">
        {diary.map((entry) => {
          const rideLogCount = Number(entry.rideLogCount);
          return (
            <li key={entry.id} className="card p-4">
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/parks/${entry.parkSlug}`}
                  className="font-semibold hover:text-accent"
                >
                  {entry.parkName}
                </Link>
                <span className="text-xs text-faint">{entry.visitedOn}</span>
              </div>
              {rideLogCount > 0 && (
                <p className="mt-1 text-xs text-faint">
                  {rideLogCount} credit{rideLogCount === 1 ? "" : "s"} logged
                </p>
              )}
              {entry.notes && <p className="mt-2 text-sm text-mut">{entry.notes}</p>}
            </li>
          );
        })}
        {diary.length === 0 && (
          <p className="text-sm text-faint">No visits logged yet.</p>
        )}
      </ul>
    </div>
  );
}
