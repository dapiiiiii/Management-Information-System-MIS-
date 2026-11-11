import { z } from "zod";
import { authConfig, PROGRAMME_OTHER } from "../config/auth.config";

/**
 * Validation for every authentication form. Field messages live here and
 * nowhere else; server-side errors are mapped in services/auth.errors.ts.
 */

const MIN_PASSWORD = authConfig.password.minLength;

const email = z
  .string()
  .trim()
  .min(1, { error: "Please enter your email address." })
  .pipe(z.email({ error: "Please enter a valid email address." }));

const newPassword = z
  .string()
  .min(1, { error: "Please create a password." })
  .min(MIN_PASSWORD, { error: `Use at least ${MIN_PASSWORD} characters.` });

const confirmPassword = z.string().min(1, { error: "Please confirm your password." });

const passwordsMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword;
const passwordMismatch = { path: ["confirmPassword"], error: "The passwords do not match." };

function isPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").length;
  return /^\+?[\d\s()-]+$/.test(value) && digits >= 7 && digits <= 15;
}

function isPastDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.getFullYear() > 1900 && date < new Date();
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Please keep this under ${max.toLocaleString("en")} characters.` });

/* ---------------------------------------------------------------- Sign in */

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Please enter your password." }),
  remember: z.boolean(),
});

/* -------------------------------------------------------- Password recovery */

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password: newPassword, confirmPassword })
  .refine(passwordsMatch, passwordMismatch);

/* ------------------------------------------------------------ Registration */

const basicShape = {
  fullName: z
    .string()
    .trim()
    .min(1, { error: "Please enter your full name." })
    .max(150, { error: "Please keep your name under 150 characters." }),
  email,
  phone: z
    .string()
    .trim()
    .min(1, { error: "Please enter your phone number." })
    .refine(isPhoneNumber, { error: "Please enter a valid phone number." }),
  password: newPassword,
  confirmPassword,
};

const personalShape = {
  dateOfBirth: z
    .string()
    .min(1, { error: "Please enter your date of birth." })
    .refine(isPastDate, { error: "Please enter a valid date of birth." }),
  gender: z.string().min(1, { error: "Please select an option." }),
  educationLevel: z.string().min(1, { error: "Please select your highest level of education." }),
  address: z
    .string()
    .trim()
    .min(1, { error: "Please enter your address." })
    .max(300, { error: "Please keep your address under 300 characters." }),
  location: z
    .string()
    .trim()
    .min(1, { error: "Please enter your region or district." })
    .max(150, { error: "Please keep this under 150 characters." }),
};

const programmeShape = {
  programmeInterest: z
    .string()
    .trim()
    .min(1, { error: "Please tell us which training you are interested in." })
    .max(200, { error: "Please keep this under 200 characters." }),
  programmeInterestOther: optionalText(200),
  relevantBackground: optionalText(1000),
  supportingInformation: optionalText(1000),
};

const interestSpecified = (data: { programmeInterest: string; programmeInterestOther: string }) =>
  data.programmeInterest !== PROGRAMME_OTHER || data.programmeInterestOther.trim().length > 0;
const interestMissing = {
  path: ["programmeInterestOther"],
  error: "Please describe the training you are interested in.",
};

export const registrationSchema = z
  .object({ ...basicShape, ...personalShape, ...programmeShape })
  .refine(passwordsMatch, passwordMismatch)
  .refine(interestSpecified, interestMissing);

export type RegistrationValues = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;
type RegistrationField = keyof RegistrationValues;

/**
 * One schema per registration step, validated before Continue. The last
 * entry is the full schema used on the review step.
 */
export const registrationStepSchemas = [
  z.object(basicShape).refine(passwordsMatch, passwordMismatch),
  z.object(personalShape),
  z.object(programmeShape).refine(interestSpecified, interestMissing),
  registrationSchema,
] as const;

/** Fields belonging to each editable step, used to route review errors back to their step. */
export const registrationStepFields = [
  Object.keys(basicShape),
  Object.keys(personalShape),
  Object.keys(programmeShape),
] as RegistrationField[][];

/** Fields never written to the session draft. */
export const registrationSecretFields = ["password", "confirmPassword"] as const satisfies RegistrationField[];

export type LoginValues = z.input<typeof loginSchema>;
export type ForgotPasswordValues = z.input<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.input<typeof resetPasswordSchema>;
