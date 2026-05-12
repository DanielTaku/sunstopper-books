/**
 * analytics.ts
 * 
 * Analytics queries for dashboard statistics.
 * Provides aggregated data on book downloads and engagement.
 */

import { getDb } from "./db";
import { books } from "../drizzle/schema";
import { desc, sql } from "drizzle-orm";

export interface BookDownloadStats {
  id: number;
  title: string;
  downloadCount: number;
  percentage: number;
}

export interface DailyDownloadStats {
  date: string;
  downloads: number;
}

export interface EngagementMetrics {
  totalDownloads: number;
  totalBooks: number;
  averageDownloadsPerBook: number;
  topBook: {
    title: string;
    downloads: number;
  } | null;
  recentlyAdded: number;
}

/**
 * Get top books by download count
 */
export async function getTopBooks(limit: number = 10): Promise<BookDownloadStats[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select({
        id: books.id,
        title: books.title,
        downloadCount: books.downloadCount,
      })
      .from(books)
      .orderBy(desc(books.downloadCount))
      .limit(limit);

    // Calculate total downloads
    const totalDownloads = result.reduce((sum, book) => sum + book.downloadCount, 0);

    // Add percentage
    return result.map((book) => ({
      ...book,
      percentage: totalDownloads > 0 ? (book.downloadCount / totalDownloads) * 100 : 0,
    }));
  } catch (error) {
    console.error("[Analytics] Failed to get top books:", error);
    return [];
  }
}

/**
 * Get engagement metrics
 */
export async function getEngagementMetrics(): Promise<EngagementMetrics> {
  const db = await getDb();
  if (!db)
    return {
      totalDownloads: 0,
      totalBooks: 0,
      averageDownloadsPerBook: 0,
      topBook: null,
      recentlyAdded: 0,
    };

  try {
    // Get all books with stats
    const allBooks = await db.select().from(books);

    const totalDownloads = allBooks.reduce((sum, book) => sum + book.downloadCount, 0);
    const totalBooks = allBooks.length;
    const averageDownloadsPerBook = totalBooks > 0 ? Math.round(totalDownloads / totalBooks) : 0;

    // Get top book
    const topBook = allBooks.length > 0 ? allBooks[0] : null;

    // Get recently added (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentlyAdded = allBooks.filter((book) => book.createdAt > sevenDaysAgo).length;

    return {
      totalDownloads,
      totalBooks,
      averageDownloadsPerBook,
      topBook: topBook
        ? {
            title: topBook.title,
            downloads: topBook.downloadCount,
          }
        : null,
      recentlyAdded,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get engagement metrics:", error);
    return {
      totalDownloads: 0,
      totalBooks: 0,
      averageDownloadsPerBook: 0,
      topBook: null,
      recentlyAdded: 0,
    };
  }
}

/**
 * Get download distribution data for pie/bar chart
 */
export async function getDownloadDistribution(): Promise<
  Array<{ name: string; value: number; fill: string }>
> {
  const db = await getDb();
  if (!db) return [];

  try {
    const topBooks = await getTopBooks(5);

    const colors = [
      "#d4a574", // Gold
      "#1a4d2e", // Forest green
      "#2d6a4f", // Medium green
      "#40916c", // Light green
      "#52b788", // Lighter green
    ];

    return topBooks.map((book, index) => ({
      name: book.title.substring(0, 20),
      value: book.downloadCount,
      fill: colors[index % colors.length],
    }));
  } catch (error) {
    console.error("[Analytics] Failed to get download distribution:", error);
    return [];
  }
}

/**
 * Generate mock daily download data for the last 30 days
 * In production, this would query actual event logs
 */
export function generateDailyDownloadTrend(): DailyDownloadStats[] {
  const data: DailyDownloadStats[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Generate realistic trend data (with some randomness)
    const baseDownloads = 15 + Math.floor(Math.random() * 25);
    const trend = Math.sin((i / 30) * Math.PI) * 10;
    const downloads = Math.max(5, Math.round(baseDownloads + trend));

    data.push({
      date: dateStr,
      downloads,
    });
  }

  return data;
}

/**
 * Get all books with their download stats
 */
export async function getAllBooksWithStats() {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        downloadCount: books.downloadCount,
        createdAt: books.createdAt,
      })
      .from(books)
      .orderBy(desc(books.downloadCount));

    return result;
  } catch (error) {
    console.error("[Analytics] Failed to get all books with stats:", error);
    return [];
  }
}
