/**
 * admin-auth.ts
 * 
 * Admin authentication procedures for password-protected admin access.
 * Uses secure JWT tokens for session validation.
 */

import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { createAdminSession, verifyAdminPassword, verifyAdminSession } from "./admin-session";

const ADMIN_SESSION_COOKIE = "admin_session_token";

export const adminAuthRouter = router({
  // Login with admin password
  login: publicProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!verifyAdminPassword(input.password)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin password",
        });
      }

      // Create secure JWT token
      const token = await createAdminSession();
      const cookieOptions = getSessionCookieOptions(ctx.req);
      
      // Set secure token cookie (24 hours)
      ctx.res.cookie(ADMIN_SESSION_COOKIE, token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevent JavaScript access
        secure: true, // HTTPS only
      });

      return {
        success: true,
        message: "Admin login successful",
      };
    }),

  // Check if user has valid admin session
  checkSession: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
    
    if (!token) {
      return {
        isAdmin: false,
        sessionId: null,
      };
    }

    // Verify token signature and expiration
    const session = await verifyAdminSession(token);
    
    if (!session) {
      return {
        isAdmin: false,
        sessionId: null,
      };
    }

    return {
      isAdmin: true,
      sessionId: session.sessionId,
    };
  }),

  // Logout from admin session
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(ADMIN_SESSION_COOKIE, {
      ...cookieOptions,
      maxAge: -1,
      httpOnly: true,
      secure: true,
    });

    return {
      success: true,
      message: "Admin logout successful",
    };
  }),
});

/**
 * Middleware to check admin session for backend procedures
 * Use this to protect admin-only procedures
 */
export async function checkAdminSession(ctx: any): Promise<boolean> {
  const token = ctx.req.cookies?.[ADMIN_SESSION_COOKIE];
  
  if (!token) {
    return false;
  }

  const session = await verifyAdminSession(token);
  return !!session;
}

/**
 * Admin procedure that requires valid session
 */
export function adminSessionProcedure(baseProcedure: any) {
  return baseProcedure.use(async ({ ctx, next }: any) => {
    const isAdmin = await checkAdminSession(ctx);
    
    if (!isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Admin session required",
      });
    }

    return next({
      ctx: {
        ...ctx,
        isAdminSession: true,
      },
    });
  });
}
