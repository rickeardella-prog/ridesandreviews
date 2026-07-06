import Link from "next/link";
import { auth, signOut } from "@/server/auth/config";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-night/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-go" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-lift" />
          </span>
          ParkLog
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/parks" className="text-mut transition hover:text-ink">
            Parks
          </Link>
          {session?.user ? (
            <>
              <Link href="/feed" className="text-mut transition hover:text-ink">
                Feed
              </Link>
              <Link href="/lists" className="text-mut transition hover:text-ink">
                Lists
              </Link>
              <Link
                href="/visits/new"
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-night transition hover:bg-accent-soft"
              >
                + Log
              </Link>
              <Link
                href={`/u/${session.user.username}`}
                className="text-mut transition hover:text-ink"
              >
                @{session.user.username}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-faint transition hover:text-ink"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-mut transition hover:text-ink">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-night transition hover:bg-accent-soft"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
