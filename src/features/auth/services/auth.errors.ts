/**
 * Typed authentication errors and their user-facing messages. Any
 * AuthService implementation should throw AuthError with one of these codes;
 * components only ever show messages from this map.
 */

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "TOKEN_INVALID"
  | "TOKEN_EXPIRED"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK"
  | "UNKNOWN";

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

export const authErrorMessages: Record<AuthErrorCode, string> = {
  // Deliberately generic: never reveal whether an email address is registered.
  INVALID_CREDENTIALS: "The email or password you entered is incorrect. Please try again.",
  TOKEN_INVALID:
    "This reset link is incomplete or has already been used. Request new recovery instructions to continue.",
  TOKEN_EXPIRED: "This reset link has expired. Request new recovery instructions to continue.",
  RATE_LIMITED: "Too many attempts. Please wait a few minutes before trying again.",
  SERVICE_UNAVAILABLE: "The platform is temporarily unavailable. Please try again shortly.",
  NETWORK: "We couldn't reach the platform. Check your connection and try again.",
  UNKNOWN: "Something went wrong. Please try again.",
};

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

export function getAuthErrorCode(error: unknown): AuthErrorCode {
  if (isAuthError(error)) return error.code;
  if (error instanceof TypeError) return "NETWORK"; // fetch rejects with TypeError when offline
  return "UNKNOWN";
}

export function getAuthErrorMessage(error: unknown): string {
  return authErrorMessages[getAuthErrorCode(error)];
}
