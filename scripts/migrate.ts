import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "../src/server/db/client";

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
