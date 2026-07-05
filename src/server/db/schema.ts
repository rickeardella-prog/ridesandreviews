import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Users -------------------------------------------------------------
// `name`/`emailVerified`/`image` are the JS property names Auth.js's
// DrizzleAdapter expects; the underlying DB columns keep the app's own
// naming (display_name/avatar_url) via the column-name argument below.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  name: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("avatar_url"),
  bio: text("bio"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Auth.js adapter tables (OAuth linking + email verification only;
// session strategy is JWT, so no `sessions` table is needed) -----------
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

// --- Parks ---------------------------------------------------------------
export const parks = pgTable("parks", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  operator: text("operator"),
  city: text("city"),
  region: text("region"),
  country: text("country").notNull(),
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lng: numeric("lng", { precision: 9, scale: 6 }),
  openedYear: integer("opened_year"),
  status: text("status").notNull().default("operating"),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  createdBy: uuid("created_by").references(() => users.id),
  approvedAt: timestamp("approved_at", { mode: "date" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Rides (belong to a park) --------------------------------------------
export const rides = pgTable(
  "rides",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    rideType: text("ride_type").notNull(),
    manufacturer: text("manufacturer"),
    openedYear: integer("opened_year"),
    status: text("status").notNull().default("operating"),
    heightFt: numeric("height_ft", { precision: 6, scale: 1 }),
    description: text("description"),
    coverImageUrl: text("cover_image_url"),
    createdBy: uuid("created_by").references(() => users.id),
    approvedAt: timestamp("approved_at", { mode: "date" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.parkId, table.slug)],
);

// --- Park reviews ---------------------------------------------------------
export const parkReviews = pgTable(
  "park_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parkId: uuid("park_id")
      .notNull()
      .references(() => parks.id, { onDelete: "cascade" }),
    rating: smallint("rating").notNull(),
    body: text("body"),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    check("park_reviews_rating_range", sql`${table.rating} between 1 and 10`),
  ],
);

// --- Ride reviews ---------------------------------------------------------
export const rideReviews = pgTable(
  "ride_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rideId: uuid("ride_id")
      .notNull()
      .references(() => rides.id, { onDelete: "cascade" }),
    rating: smallint("rating").notNull(),
    body: text("body"),
    isPublic: boolean("is_public").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    check("ride_reviews_rating_range", sql`${table.rating} between 1 and 10`),
  ],
);

// --- Visits (diary entries: one visit to a park on a date) --------------
export const visits = pgTable("visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parkId: uuid("park_id")
    .notNull()
    .references(() => parks.id, { onDelete: "cascade" }),
  visitedOn: date("visited_on").notNull(),
  notes: text("notes"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Ride logs (rides ridden within a visit) -----------------------------
export const rideLogs = pgTable("ride_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitId: uuid("visit_id")
    .notNull()
    .references(() => visits.id, { onDelete: "cascade" }),
  rideId: uuid("ride_id")
    .notNull()
    .references(() => rides.id, { onDelete: "cascade" }),
  riddenAt: timestamp("ridden_at", { mode: "date" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Follows ---------------------------------------------------------------
export const follows = pgTable(
  "follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followeeId: uuid("followee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followeeId] }),
    check("follows_no_self_follow", sql`${table.followerId} <> ${table.followeeId}`),
  ],
);

// --- Lists -----------------------------------------------------------------
export const lists = pgTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(true),
  isRanked: boolean("is_ranked").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const listItems = pgTable(
  "list_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    parkId: uuid("park_id").references(() => parks.id, { onDelete: "cascade" }),
    rideId: uuid("ride_id").references(() => rides.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "list_items_exactly_one_target",
      sql`(${table.parkId} is not null and ${table.rideId} is null) or (${table.parkId} is null and ${table.rideId} is not null)`,
    ),
    unique().on(table.listId, table.position),
  ],
);

// --- Relations (for query ergonomics, not required by the DB itself) ----
export const parksRelations = relations(parks, ({ many }) => ({
  rides: many(rides),
  reviews: many(parkReviews),
}));

export const ridesRelations = relations(rides, ({ one, many }) => ({
  park: one(parks, { fields: [rides.parkId], references: [parks.id] }),
  reviews: many(rideReviews),
}));

export const usersRelations = relations(users, ({ many }) => ({
  parkReviews: many(parkReviews),
  rideReviews: many(rideReviews),
  visits: many(visits),
}));

export const visitsRelations = relations(visits, ({ one, many }) => ({
  user: one(users, { fields: [visits.userId], references: [users.id] }),
  park: one(parks, { fields: [visits.parkId], references: [parks.id] }),
  rideLogs: many(rideLogs),
}));

export const rideLogsRelations = relations(rideLogs, ({ one }) => ({
  visit: one(visits, { fields: [rideLogs.visitId], references: [visits.id] }),
  ride: one(rides, { fields: [rideLogs.rideId], references: [rides.id] }),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(users, { fields: [lists.userId], references: [users.id] }),
  items: many(listItems),
}));

export const listItemsRelations = relations(listItems, ({ one }) => ({
  list: one(lists, { fields: [listItems.listId], references: [lists.id] }),
  park: one(parks, { fields: [listItems.parkId], references: [parks.id] }),
  ride: one(rides, { fields: [listItems.rideId], references: [rides.id] }),
}));

export const parkReviewsRelations = relations(parkReviews, ({ one }) => ({
  user: one(users, { fields: [parkReviews.userId], references: [users.id] }),
  park: one(parks, { fields: [parkReviews.parkId], references: [parks.id] }),
}));

export const rideReviewsRelations = relations(rideReviews, ({ one }) => ({
  user: one(users, { fields: [rideReviews.userId], references: [users.id] }),
  ride: one(rides, { fields: [rideReviews.rideId], references: [rides.id] }),
}));
