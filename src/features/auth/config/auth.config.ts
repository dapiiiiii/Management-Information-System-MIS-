/**
 * Authentication configuration: the one place to adjust auth behaviour on
 * the frontend. Imported by the proxy, so keep it free of browser-only code.
 */

/** Value used in the programme interest list for "Other (please specify)". */
export const PROGRAMME_OTHER = "__other__";

export const authConfig = {
  /**
   * Which AuthService implementation to use. "mock" selects the isolated
   * mock in services/auth.mock.ts. Set NEXT_PUBLIC_AUTH_MODE=api once the
   * platform API implementation exists.
   */
  mode: process.env.NEXT_PUBLIC_AUTH_MODE === "api" ? ("api" as const) : ("mock" as const),

  password: {
    /**
     * PENDING SECURITY SPECIFICATION. This minimum length is the only
     * password rule enforced by the frontend. Do not add further rules here
     * until the security specification defines them; the backend remains the
     * authority.
     */
    minLength: 8,
  },

  session: {
    /** Cookie the proxy checks before serving /app/* routes. */
    cookieName: "tce_session",
    rememberMeDays: 30,
    defaultHours: 12,
  },

  /** Prefix for every browser-storage key the app writes; cleared on sign-out. */
  storagePrefix: "tce:",

  routes: {
    home: "/",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },

  /** How long the "Signed in" confirmation shows before redirecting. */
  postLoginDelayMs: 900,

  registration: {
    genderOptions: ["Female", "Male", "Prefer not to say"],
    educationLevels: [
      "Primary education",
      "Secondary education",
      "Technical and vocational (TVET)",
      "Diploma",
      "Bachelor's degree or higher",
      "Other",
    ],
    /**
     * PENDING PROGRAMME CATALOGUE. Training options offered at registration.
     * While empty, applicants describe their interest in free text. When
     * populated, they choose from this list or "Other (please specify)".
     */
    programmeOptions: [] as readonly string[],
  },
} as const;
