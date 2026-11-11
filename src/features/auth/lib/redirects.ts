import { authConfig } from "../config/auth.config";
import { roleHomeRoute, type Role } from "../config/roles";

const AUTH_PATHS = new Set<string>([
  authConfig.routes.login,
  authConfig.routes.register,
  authConfig.routes.forgotPassword,
  authConfig.routes.resetPassword,
]);

const BASE = "https://same-origin.invalid";

/**
 * Returns `value` only if it is a same-origin relative path, otherwise null.
 * Rejects absolute and protocol-relative URLs, backslash tricks, control
 * characters and auth pages, to prevent open redirects and loops.
 */
export function safeRedirectPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  // eslint-disable-next-line no-control-regex -- rejecting control characters is the point
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value, BASE);
    if (url.origin !== BASE || AUTH_PATHS.has(url.pathname)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

/** Where to go after signing in: a safe `next` path if one was given, else the role's home. */
export function resolvePostLoginPath(role: Role, next: string | null): string {
  return safeRedirectPath(next) ?? roleHomeRoute[role];
}

/** Reads `?next=` from the current URL at the moment it is needed. */
export function readNextParam(): string | null {
  return new URLSearchParams(window.location.search).get("next");
}

/** The sign-in URL that returns the visitor to `path` afterwards. */
export function loginPathFor(path: string): string {
  return `${authConfig.routes.login}?next=${encodeURIComponent(path)}`;
}
