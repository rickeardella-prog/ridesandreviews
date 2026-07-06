import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getListById } from "@/server/services/lists";
import { listParks } from "@/server/services/parks";
import { listAllRidesForSelector } from "@/server/services/rides";
import { AddItemForm } from "./add-item-form";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const list = await getListById(id);
  if (!list) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === list.userId;

  const [parks, rides] = isOwner
    ? await Promise.all([listParks(), listAllRidesForSelector()])
    : [[], []];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{list.title}</h1>
      <p className="mt-1 text-sm text-mut">
        by{" "}
        <Link href={`/u/${list.username}`} className="font-semibold hover:text-accent">
          @{list.username}
        </Link>{" "}
        · <span className="chip">{list.isRanked ? "ranked" : "unranked"}</span>
      </p>
      {list.description && <p className="mt-3 text-mut">{list.description}</p>}

      <ol className="mt-8 flex flex-col gap-2">
        {list.items.map((item, index) => (
          <li key={item.id} className="card flex items-center gap-3 p-3">
            {list.isRanked && (
              <span className="w-8 shrink-0 text-center text-lg font-extrabold text-accent">
                {index + 1}
              </span>
            )}
            <div className="min-w-0">
              {item.parkSlug ? (
                <Link
                  href={`/parks/${item.parkSlug}`}
                  className="font-semibold hover:text-accent"
                >
                  {item.parkName}
                </Link>
              ) : (
                <Link
                  href={`/parks/${item.rideParkSlug}/rides/${item.rideSlug}`}
                  className="font-semibold hover:text-accent"
                >
                  {item.rideName}
                </Link>
              )}
              {item.note && (
                <span className="block text-sm text-faint">{item.note}</span>
              )}
            </div>
          </li>
        ))}
        {list.items.length === 0 && (
          <p className="text-sm text-faint">No items yet.</p>
        )}
      </ol>

      {isOwner && (
        <div className="card mt-10 p-4">
          <h2 className="eyebrow mb-3">Add an item</h2>
          <AddItemForm
            listId={list.id}
            parks={parks.map((p) => ({ id: p.id, name: p.name }))}
            rides={rides.map((r) => ({
              id: r.id,
              name: r.name,
              parkName: r.parkName,
            }))}
          />
        </div>
      )}
    </div>
  );
}
