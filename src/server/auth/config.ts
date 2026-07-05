import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db } from "../db/client";
import { accounts, users, verificationTokens } from "../db/schema";
import { generateUniqueUsername } from "../services/users";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      const email = credentials?.email;
      const password = credentials?.password;
      if (typeof email !== "string" || typeof password !== "string") {
        return null;
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

const baseAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  verificationTokensTable: verificationTokens,
}) as Required<Adapter>;

// OAuth providers (e.g. Google) only supply name/email/image, but every
// user in this app needs a unique `username` for their profile URL.
const adapter: Adapter = {
  ...baseAdapter,
  async createUser(user: AdapterUser) {
    const seed = user.email?.split("@")[0] ?? user.name ?? "user";
    const username = await generateUniqueUsername(seed);
    return baseAdapter.createUser({ ...user, username } as AdapterUser);
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  cookies: {
    sessionToken: {
      name: "theme-parks.session-token",
    },
  },
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | undefined;
      }
      return session;
    },
  },
});
