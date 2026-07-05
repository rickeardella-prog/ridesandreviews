import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pglite?: PGlite };

export const client =
  globalForDb.pglite ?? new PGlite("./.pglite-data");

if (process.env.NODE_ENV !== "production") {
  globalForDb.pglite = client;
}

export const db = drizzle({ client, schema });
