import Link from "next/link";
import { signInWithGoogle } from "@/server/auth/actions";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Sign up</h1>
      <SignupForm />
      {googleEnabled && (
        <>
          <div className="my-4 flex items-center gap-3 text-xs text-zinc-500">
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
            or
            <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
            >
              Continue with Google
            </button>
          </form>
        </>
      )}
      <p className="mt-4 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
