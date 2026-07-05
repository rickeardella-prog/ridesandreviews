import { migrate } from "drizzle-orm/pglite/migrator";
import { client, db } from "../src/server/db/client";

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
