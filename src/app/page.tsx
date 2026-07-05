import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">ParkLog</h1>
      <p className="text-lg text-zinc-500">
        Rate and review theme parks and rides. Log your visits, follow other
        riders, and build lists of your favorites.
      </p>
      <Link
        href="/parks"
        className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Browse parks
      </Link>
    </div>
  );
}
