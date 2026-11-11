import { authConfig } from "../config/auth.config";
import type { Role } from "../config/roles";
import type { RegistrationData } from "../schemas/auth.schemas";
import { mockAuthService } from "./auth.mock";

/**
 * The contract between the UI and the platform's authentication API.
 * Components depend only on this interface. To connect the real API,
 * implement AuthService and return it from resolveAuthService() below.
 * Implementations throw AuthError (see auth.errors.ts) on failure.
 */

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

export type Session = {
  user: AuthUser;
  /** ISO 8601 timestamp. */
  expiresAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
  /** Keep the session beyond the browser session. */
  remember: boolean;
};

/** Registration always creates a trainee account; there is no role field. */
export type RegistrationInput = Omit<RegistrationData, "confirmPassword">;

export type PasswordResetRequest = { email: string };

export type PasswordResetInput = { token: string; password: string };

export interface AuthService {
  login(input: LoginInput): Promise<Session>;
  register(input: RegistrationInput): Promise<void>;
  /** Resolves the same way whether or not the account exists. */
  requestPasswordReset(input: PasswordResetRequest): Promise<void>;
  resetPassword(input: PasswordResetInput): Promise<void>;
  logout(): Promise<void>;
  getSession(): Promise<Session | null>;
}

function resolveAuthService(): AuthService {
  if (authConfig.mode === "mock") return mockAuthService;
  throw new Error(
    "NEXT_PUBLIC_AUTH_MODE is 'api' but no API AuthService is configured. Implement AuthService against the platform API and return it from resolveAuthService().",
  );
}

export const authService: AuthService = resolveAuthService();
