import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { listUserLists } from "@/server/services/lists";

export default async function ListsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const lists = await listUserLists(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your lists</h1>
        <Link
          href="/lists/new"
          className="rounded bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          New list
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {lists.map((list) => (
          <li key={list.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <Link href={`/lists/${list.id}`} className="font-medium underline">
              {list.title}
            </Link>
            {list.description && (
              <p className="mt-1 text-sm text-zinc-500">{list.description}</p>
            )}
          </li>
        ))}
        {lists.length === 0 && (
          <p className="text-sm text-zinc-500">
            No lists yet.{" "}
            <Link href="/lists/new" className="underline">
              Create one
            </Link>
            .
          </p>
        )}
      </ul>
    </div>
  );
}
