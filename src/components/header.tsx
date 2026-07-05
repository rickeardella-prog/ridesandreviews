import Link from "next/link";
import { auth, signOut } from "@/server/auth/config";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          ParkLog
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/parks">Parks</Link>
          {session?.user ? (
            <>
              <Link href="/feed">Feed</Link>
              <Link href="/lists">Lists</Link>
              <Link href="/visits/new">Log a visit</Link>
              <Link href={`/u/${session.user.username}`} className="text-zinc-500">
                @{session.user.username}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="underline">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
