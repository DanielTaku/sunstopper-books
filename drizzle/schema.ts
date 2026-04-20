import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Books table — metadata stored in DB, file bytes in S3
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  subtitle: varchar("subtitle", { length: 256 }),
  author: varchar("author", { length: 256 }).notNull(),
  publisher: varchar("publisher", { length: 256 }),
  year: int("year"),
  pages: int("pages"),
  fileSizeBytes: bigint("fileSizeBytes", { mode: "number" }),
  category: varchar("category", { length: 128 }),
  description: text("description"),
  // S3 storage keys
  pdfKey: varchar("pdfKey", { length: 512 }).notNull(),
  coverKey: varchar("coverKey", { length: 512 }),
  // Derived URLs (served via /manus-storage/)
  pdfUrl: varchar("pdfUrl", { length: 1024 }).notNull(),
  coverUrl: varchar("coverUrl", { length: 1024 }),
  isbn: varchar("isbn", { length: 64 }),
  featured: mysqlEnum("featured", ["0", "1"]).default("0").notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;