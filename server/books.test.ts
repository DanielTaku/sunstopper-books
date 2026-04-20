import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock the db module
vi.mock("./db", () => ({
  getAllBooks: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "test-book",
      title: "Test Book",
      subtitle: null,
      author: "Test Author",
      publisher: null,
      year: 2024,
      pages: 100,
      fileSizeBytes: 1000000,
      category: "Spiritual Guidance",
      description: "A test book",
      pdfKey: "books/pdf/test-book.pdf",
      pdfUrl: "/manus-storage/books/pdf/test-book.pdf",
      coverKey: null,
      coverUrl: null,
      isbn: null,
      featured: "0" as const,
      downloadCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  insertBook: vi.fn().mockResolvedValue(undefined),
  updateBook: vi.fn().mockResolvedValue(undefined),
  deleteBook: vi.fn().mockResolvedValue(undefined),
  incrementDownloadCount: vi.fn().mockResolvedValue(undefined),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "books/pdf/test-book-123.pdf",
    url: "/manus-storage/books/pdf/test-book-123.pdf",
  }),
}));

function makeCtx(role: "admin" | "user" | null = null): TrpcContext {
  const user: User | null = role
    ? {
        id: 1,
        openId: "test-user",
        name: "Test User",
        email: "test@example.com",
        loginMethod: "manus",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("books.list", () => {
  it("returns all books for public users", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.books.list();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Test Book");
  });
});

describe("books.recordDownload", () => {
  it("increments download count for any user", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.books.recordDownload({ id: 1 });
    expect(result.success).toBe(true);
  });
});

describe("books.delete", () => {
  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.books.delete({ id: 1 })).rejects.toThrow();
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.books.delete({ id: 1 })).rejects.toThrow(/Admin access required/);
  });

  it("succeeds for admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.books.delete({ id: 1 });
    expect(result.success).toBe(true);
  });
});

describe("books.upload", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.books.upload({
        slug: "test-book",
        title: "Test Book",
        author: "Test Author",
        pdfBase64: Buffer.from("fake-pdf").toString("base64"),
        pdfFilename: "test.pdf",
      })
    ).rejects.toThrow(/Admin access required/);
  });

  it("calls storagePut and insertBook for admin users", async () => {
    const { storagePut } = await import("./storage");
    const { insertBook } = await import("./db");
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.books.upload({
      slug: "new-book",
      title: "New Book",
      author: "New Author",
      pdfBase64: Buffer.from("fake-pdf-content").toString("base64"),
      pdfFilename: "new-book.pdf",
      pdfSizeBytes: 1000,
      category: "Spiritual Guidance",
    });
    expect(result.success).toBe(true);
    expect(storagePut).toHaveBeenCalled();
    expect(insertBook).toHaveBeenCalled();
  });
});

describe("books.update", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.books.update({ id: 1, title: "New Title" })).rejects.toThrow(/Admin access required/);
  });

  it("succeeds for admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.books.update({ id: 1, title: "Updated Title" });
    expect(result.success).toBe(true);
  });
});
