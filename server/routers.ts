import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllBooks,
  insertBook,
  updateBook,
  deleteBook,
  incrementDownloadCount,
} from "./db";
import { storagePut } from "./storage";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  books: router({
    // Public: list all books
    list: publicProcedure.query(async () => {
      return getAllBooks();
    }),

    // Public: increment download count
    recordDownload: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await incrementDownloadCount(input.id);
        return { success: true };
      }),

    // Admin: upload a new book (PDF + optional cover) via base64
    upload: adminProcedure
      .input(
        z.object({
          slug: z.string().min(2).max(128),
          title: z.string().min(1).max(256),
          subtitle: z.string().max(256).optional(),
          author: z.string().min(1).max(256),
          publisher: z.string().max(256).optional(),
          year: z.number().int().min(1900).max(2100).optional(),
          pages: z.number().int().min(1).optional(),
          category: z.string().max(128).optional(),
          description: z.string().optional(),
          isbn: z.string().max(64).optional(),
          featured: z.boolean().optional(),
          pdfBase64: z.string(),
          pdfMimeType: z.string().default("application/pdf"),
          pdfFilename: z.string(),
          pdfSizeBytes: z.number().optional(),
          coverBase64: z.string().optional(),
          coverMimeType: z.string().optional(),
          coverFilename: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const pdfBuffer = Buffer.from(input.pdfBase64, "base64");
        const pdfKey = `books/pdf/${input.slug}-${Date.now()}.pdf`;
        const { url: pdfUrl } = await storagePut(pdfKey, pdfBuffer, input.pdfMimeType);

        let coverKey: string | undefined;
        let coverUrl: string | undefined;
        if (input.coverBase64 && input.coverMimeType) {
          const coverBuffer = Buffer.from(input.coverBase64, "base64");
          const ext = input.coverFilename?.split(".").pop() ?? "jpg";
          coverKey = `books/covers/${input.slug}-${Date.now()}.${ext}`;
          const result = await storagePut(coverKey, coverBuffer, input.coverMimeType);
          coverUrl = result.url;
        }

        await insertBook({
          slug: input.slug,
          title: input.title,
          subtitle: input.subtitle ?? null,
          author: input.author,
          publisher: input.publisher ?? null,
          year: input.year ?? null,
          pages: input.pages ?? null,
          fileSizeBytes: input.pdfSizeBytes ?? null,
          category: input.category ?? null,
          description: input.description ?? null,
          pdfKey,
          pdfUrl,
          coverKey: coverKey ?? null,
          coverUrl: coverUrl ?? null,
          isbn: input.isbn ?? null,
          featured: input.featured ? "1" : "0",
        });

        return { success: true, pdfUrl, coverUrl };
      }),

    // Admin: update book metadata
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(256).optional(),
          subtitle: z.string().max(256).optional(),
          author: z.string().min(1).max(256).optional(),
          publisher: z.string().max(256).optional(),
          year: z.number().int().optional(),
          pages: z.number().int().optional(),
          category: z.string().max(128).optional(),
          description: z.string().optional(),
          isbn: z.string().max(64).optional(),
          featured: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, featured, ...rest } = input;
        await updateBook(id, {
          ...rest,
          ...(featured !== undefined ? { featured: featured ? "1" : "0" } : {}),
        });
        return { success: true };
      }),

    // Admin: delete a book
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBook(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
