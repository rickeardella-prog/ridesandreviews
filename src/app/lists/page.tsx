import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { listUserLists } from "@/server/services/lists";

export default async function ListsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lists = await listUserLists(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-1">Rank everything</p>
          <h1 className="text-3xl font-bold tracking-tight">Your lists</h1>
        </div>
        <Link href="/lists/new" className="btn-primary">
          + New list
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {lists.map((list) => (
          <li key={list.id}>
            <Link href={`/lists/${list.id}`} className="card block p-4">
              <span className="font-semibold">{list.title}</span>
              {list.description && (
                <p className="mt-1 text-sm text-mut">{list.description}</p>
              )}
            </Link>
          </li>
        ))}
        {lists.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-mut">
              No lists yet. Top 10 coasters? Most overrated flat rides? Get
              ranking.
            </p>
            <Link href="/lists/new" className="btn-secondary mt-4">
              Create your first list
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
}
