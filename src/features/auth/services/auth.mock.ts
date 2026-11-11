/**
 * MOCK: replace with real API.
 *
 * A stand-in AuthService for frontend development only. It simulates network
 * latency and the success and failure paths the UI must handle. It performs
 * no real authentication and must never ship to production: selection is
 * controlled by authConfig.mode (NEXT_PUBLIC_AUTH_MODE).
 *
 * Demo sign-in: any address below with the password "demo-pass-2026".
 *   trainee@example.org      trainer@example.org     assessor@example.org
 *   coordinator@example.org  manager@example.org     admin@example.org
 *   me@example.org           partner@example.org
 *
 * Simulated failures:
 *   unavailable@example.org  any action returns SERVICE_UNAVAILABLE
 *   reset token "expired"    TOKEN_EXPIRED; token "invalid" TOKEN_INVALID
 */

import { authConfig } from "../config/auth.config";
import { isRole } from "../config/roles";
import { AuthError } from "./auth.errors";
import type { AuthService, AuthUser, Session } from "./auth.service";

const LATENCY_MS = 850;
const DEMO_PASSWORD = "demo-pass-2026";
const UNAVAILABLE_EMAIL = "unavailable@example.org";

const DEMO_ACCOUNTS: readonly AuthUser[] = [
  { id: "demo-trainee", fullName: "Amina Hassan", email: "trainee@example.org", role: "trainee" },
  { id: "demo-trainer", fullName: "Daniel Mwangi", email: "trainer@example.org", role: "trainer" },
  { id: "demo-assessor", fullName: "Grace Wanjiru", email: "assessor@example.org", role: "assessor" },
  { id: "demo-coordinator", fullName: "Hana Tesfaye", email: "coordinator@example.org", role: "training_coordinator" },
  { id: "demo-manager", fullName: "Joseph Banda", email: "manager@example.org", role: "project_manager" },
  { id: "demo-admin", fullName: "Mercy Otieno", email: "admin@example.org", role: "system_administrator" },
  { id: "demo-me", fullName: "Samuel Okafor", email: "me@example.org", role: "me_officer" },
  { id: "demo-partner", fullName: "Fatuma Ali", email: "partner@example.org", role: "funder_partner" },
];

const wait = (ms = LATENCY_MS) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const normalize = (email: string) => email.trim().toLowerCase();

function failIfUnavailable(email: string) {
  if (normalize(email) === UNAVAILABLE_EMAIL) throw new AuthError("SERVICE_UNAVAILABLE");
}

/* The mock keeps its session in a readable cookie so the /app proxy check
   works end to end. A real API sets an httpOnly cookie server-side instead. */

const COOKIE = authConfig.session.cookieName;

function writeSessionCookie(session: Session, persistent: boolean) {
  const value = encodeURIComponent(JSON.stringify(session));
  const maxAge = persistent ? `; Max-Age=${authConfig.session.rememberMeDays * 24 * 60 * 60}` : "";
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Path=/; SameSite=Lax${maxAge}${secure}`;
}

function clearSessionCookie() {
  document.cookie = `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function readSessionCookie(): Session | null {
  const entry = document.cookie.split("; ").find((part) => part.startsWith(`${COOKIE}=`));
  if (!entry) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(entry.slice(COOKIE.length + 1)));
    if (!isSession(parsed) || new Date(parsed.expiresAt).getTime() <= Date.now()) {
      clearSessionCookie();
      return null;
    }
    return parsed;
  } catch {
    clearSessionCookie();
    return null;
  }
}

function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const { user, expiresAt } = value as Partial<Session>;
  return (
    typeof expiresAt === "string" &&
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string" &&
    typeof user.fullName === "string" &&
    typeof user.email === "string" &&
    isRole(user.role)
  );
}

export const mockAuthService: AuthService = {
  async login({ email, password, remember }) {
    await wait();
    failIfUnavailable(email);
    const user = DEMO_ACCOUNTS.find((account) => account.email === normalize(email));
    if (!user || password !== DEMO_PASSWORD) throw new AuthError("INVALID_CREDENTIALS");

    const lifetimeMs = remember
      ? authConfig.session.rememberMeDays * 24 * 60 * 60 * 1000
      : authConfig.session.defaultHours * 60 * 60 * 1000;
    const session: Session = { user, expiresAt: new Date(Date.now() + lifetimeMs).toISOString() };
    writeSessionCookie(session, remember);
    return session;
  },

  async register(input) {
    await wait(1100);
    failIfUnavailable(input.email);
    // Accepted. Activation is handled by the programme, outside this flow.
  },

  async requestPasswordReset({ email }) {
    await wait();
    failIfUnavailable(email);
    // Same outcome whether or not the account exists.
  },

  async resetPassword({ token }) {
    await wait();
    if (token === "expired") throw new AuthError("TOKEN_EXPIRED");
    if (!token || token === "invalid") throw new AuthError("TOKEN_INVALID");
  },

  async logout() {
    clearSessionCookie();
    await wait(150);
  },

  async getSession() {
    return readSessionCookie();
  },
};
