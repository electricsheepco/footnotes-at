import bcrypt from "bcrypt";
import { db } from "./db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BCRYPT_ROUNDS = 12;
const SESSION_COOKIE = "fn_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session token generation (cryptographically secure)
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Create a new session for a user
export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await db.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// Get the current session and user (returns null if invalid/expired)
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          handle: true,
          displayName: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // Check expiry
  if (session.expiresAt < new Date()) {
    // Clean up expired session
    await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

// Require authentication - redirects to login if not authenticated
export async function requireAuth(redirectPath?: string) {
  const session = await getSession();

  if (!session) {
    const loginUrl = redirectPath
      ? `/login?next=${encodeURIComponent(redirectPath)}`
      : "/login";
    redirect(loginUrl);
  }

  return session;
}

// Destroy the current session
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.session.deleteMany({ where: { token } });
  }

  cookieStore.delete(SESSION_COOKIE);
}

// Clean up expired sessions (call periodically or on login)
export async function cleanupExpiredSessions() {
  await db.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
}
