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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-semibold">{list.title}</h1>
      <p className="text-zinc-500">
        by @{list.username} · {list.isRanked ? "ranked" : "unranked"}
      </p>
      {list.description && <p className="mt-2">{list.description}</p>}

      <ol
        className={
          list.isRanked
            ? "mt-6 flex flex-col gap-2 list-decimal pl-5"
            : "mt-6 flex flex-col gap-2"
        }
      >
        {list.items.map((item) => (
          <li key={item.id}>
            {item.parkSlug ? (
              <Link href={`/parks/${item.parkSlug}`} className="underline">
                {item.parkName}
              </Link>
            ) : (
              <Link
                href={`/parks/${item.rideParkSlug}/rides/${item.rideSlug}`}
                className="underline"
              >
                {item.rideName}
              </Link>
            )}
            {item.note && <span className="ml-2 text-sm text-zinc-500">{item.note}</span>}
          </li>
        ))}
        {list.items.length === 0 && (
          <p className="text-sm text-zinc-500">No items yet.</p>
        )}
      </ol>

      {isOwner && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Add an item</h2>
          <AddItemForm
            listId={list.id}
            parks={parks.map((p) => ({ id: p.id, name: p.name }))}
            rides={rides.map((r) => ({ id: r.id, name: r.name, parkName: r.parkName }))}
          />
        </div>
      )}
    </div>
  );
}
