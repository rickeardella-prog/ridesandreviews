import Link from "next/link";
import { signInWithGoogle } from "@/server/auth/actions";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <p className="eyebrow mb-1">Welcome back</p>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Log in</h1>
      <div className="card p-6">
        <LoginForm />
        {googleEnabled && (
          <>
            <div className="my-4 flex items-center gap-3 text-xs text-faint">
              <div className="h-px flex-1 bg-line" />
              or
              <div className="h-px flex-1 bg-line" />
            </div>
            <form action={signInWithGoogle}>
              <button type="submit" className="btn-secondary w-full">
                Continue with Google
              </button>
            </form>
          </>
        )}
      </div>
      <p className="mt-4 text-sm text-mut">
        No account?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
