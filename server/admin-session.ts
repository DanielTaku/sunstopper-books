/**
 * admin-session.ts
 * 
 * Secure admin session management using signed JWT tokens.
 * Prevents session forgery and provides server-side validation.
 */

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "admin-secret-key-change-in-production"
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "2020taku";

interface AdminSessionPayload {
  sessionId: string;
  timestamp: number;
  type: "admin";
  [key: string]: any;
}

/**
 * Create a signed admin session token
 */
export async function createAdminSession(): Promise<string> {
  const sessionId = `admin_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  
  const token = await new SignJWT({
    sessionId,
    timestamp: Date.now(),
    type: "admin",
  } as AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode an admin session token
 */
export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as unknown as AdminSessionPayload;
    
    // Verify it's an admin token
    if (payload.type !== "admin") {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
