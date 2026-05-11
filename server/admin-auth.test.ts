import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(): {
  ctx: TrpcContext;
  cookies: Record<string, string>;
  setCookies: Array<{ name: string; value: string; options: any }>;
} {
  const cookies: Record<string, string> = {};
  const setCookies: Array<{ name: string; value: string; options: any }> = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
      cookies,
    } as any,
    res: {
      cookie: (name: string, value: string, options: any) => {
        setCookies.push({ name, value, options });
        cookies[name] = value;
      },
      clearCookie: (name: string, options: any) => {
        delete cookies[name];
        setCookies.push({ name, value: "", options });
      },
    } as any,
  };

  return { ctx, cookies, setCookies };
}

describe("adminAuth", () => {
  describe("login", () => {
    it("rejects invalid password", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.adminAuth.login({ password: "wrong-password" });
        expect.fail("Should have thrown");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
        expect(error.message).toContain("Invalid admin password");
      }
    });

    it("accepts correct password and sets session cookie", async () => {
      const { ctx, setCookies } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.login({ password: "2020taku" });

      expect(result.success).toBe(true);
      expect(result.message).toContain("successful");
      
      // Verify cookie was set
      const sessionCookie = setCookies.find((c) => c.name === "admin_session_token");
      expect(sessionCookie).toBeDefined();
      expect(sessionCookie?.options.httpOnly).toBe(true);
      expect(sessionCookie?.options.secure).toBe(true);
    });
  });

  describe("checkSession", () => {
    it("returns false when no session cookie exists", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.checkSession();

      expect(result.isAdmin).toBe(false);
      expect(result.sessionId).toBeNull();
    });

    it("returns false with invalid token", async () => {
      const { ctx } = createMockContext();
      ctx.req.cookies = { admin_session_token: "invalid-token" };
      const caller = appRouter.createCaller(ctx);

      const result = await caller.adminAuth.checkSession();

      expect(result.isAdmin).toBe(false);
      expect(result.sessionId).toBeNull();
    });

    it("returns true with valid session after login", async () => {
      const { ctx, cookies } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // Login first
      await caller.adminAuth.login({ password: "2020taku" });

      // Check session
      const result = await caller.adminAuth.checkSession();

      expect(result.isAdmin).toBe(true);
      expect(result.sessionId).toBeDefined();
      expect(result.sessionId).toContain("admin_");
    });
  });

  describe("logout", () => {
    it("clears admin session cookie", async () => {
      const { ctx, setCookies } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // Login first
      await caller.adminAuth.login({ password: "2020taku" });
      setCookies.length = 0; // Clear previous calls

      // Logout
      const result = await caller.adminAuth.logout();

      expect(result.success).toBe(true);
      
      // Verify cookie was cleared
      const clearCookie = setCookies.find((c) => c.name === "admin_session_token");
      expect(clearCookie).toBeDefined();
      expect(clearCookie?.options.maxAge).toBe(-1);
    });
  });

  describe("full flow", () => {
    it("allows login, check, and logout sequence", async () => {
      const { ctx } = createMockContext();
      const caller = appRouter.createCaller(ctx);

      // Initially not admin
      let result = await caller.adminAuth.checkSession();
      expect(result.isAdmin).toBe(false);

      // Login
      const loginResult = await caller.adminAuth.login({ password: "2020taku" });
      expect(loginResult.success).toBe(true);

      // Now admin
      result = await caller.adminAuth.checkSession();
      expect(result.isAdmin).toBe(true);

      // Logout
      const logoutResult = await caller.adminAuth.logout();
      expect(logoutResult.success).toBe(true);

      // No longer admin
      result = await caller.adminAuth.checkSession();
      expect(result.isAdmin).toBe(false);
    });
  });
});
