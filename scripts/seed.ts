import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { eq } from "drizzle-orm";
import { db } from "../src/server/db/client";
import { parks, rides } from "../src/server/db/schema";

const seedDir = path.join(__dirname, "../src/server/db/seed");

type ParkRow = {
  slug: string;
  name: string;
  operator: string;
  city: string;
  region: string;
  country: string;
  lat: string;
  lng: string;
  opened_year: string;
  status: string;
  description: string;
};

type RideRow = {
  park_slug: string;
  slug: string;
  name: string;
  ride_type: string;
  manufacturer: string;
  opened_year: string;
  status: string;
  height_ft: string;
  description: string;
};

function readCsv<T>(filename: string): T[] {
  const raw = readFileSync(path.join(seedDir, filename), "utf-8");
  return parse(raw, { columns: true, skip_empty_lines: true }) as T[];
}

async function main() {
  const parkRows = readCsv<ParkRow>("parks.csv");
  const rideRows = readCsv<RideRow>("rides.csv");

  for (const row of parkRows) {
    await db
      .insert(parks)
      .values({
        slug: row.slug,
        name: row.name,
        operator: row.operator || null,
        city: row.city || null,
        region: row.region || null,
        country: row.country,
        lat: row.lat || null,
        lng: row.lng || null,
        openedYear: row.opened_year ? Number(row.opened_year) : null,
        status: row.status || "operating",
        description: row.description || null,
        approvedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: parks.slug,
        set: {
          name: row.name,
          operator: row.operator || null,
          city: row.city || null,
          region: row.region || null,
          country: row.country,
          lat: row.lat || null,
          lng: row.lng || null,
          openedYear: row.opened_year ? Number(row.opened_year) : null,
          status: row.status || "operating",
          description: row.description || null,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`Seeded ${parkRows.length} parks`);

  for (const row of rideRows) {
    const [park] = await db
      .select({ id: parks.id })
      .from(parks)
      .where(eq(parks.slug, row.park_slug))
      .limit(1);
    if (!park) {
      console.warn(`Skipping ride ${row.slug}: park ${row.park_slug} not found`);
      continue;
    }

    await db
      .insert(rides)
      .values({
        parkId: park.id,
        slug: row.slug,
        name: row.name,
        rideType: row.ride_type,
        manufacturer: row.manufacturer || null,
        openedYear: row.opened_year ? Number(row.opened_year) : null,
        status: row.status || "operating",
        heightFt: row.height_ft || null,
        description: row.description || null,
        approvedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [rides.parkId, rides.slug],
        set: {
          name: row.name,
          rideType: row.ride_type,
          manufacturer: row.manufacturer || null,
          openedYear: row.opened_year ? Number(row.opened_year) : null,
          status: row.status || "operating",
          heightFt: row.height_ft || null,
          description: row.description || null,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`Seeded ${rideRows.length} rides`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
