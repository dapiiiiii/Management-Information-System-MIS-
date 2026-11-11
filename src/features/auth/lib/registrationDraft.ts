import { authConfig } from "../config/auth.config";
import {
  registrationSecretFields,
  registrationStepFields,
  type RegistrationValues,
} from "../schemas/auth.schemas";
import { readStoredJSON, removeStored, writeStoredJSON } from "./storage";

/**
 * Registration draft, kept in sessionStorage so it survives a refresh within
 * the browser session. Passwords are never written.
 */

const KEY = `${authConfig.storagePrefix}register-draft`;
const secret = new Set<string>(registrationSecretFields);
const draftFields = registrationStepFields.flat().filter((field) => !secret.has(field));

export type RegistrationDraft = Partial<Omit<RegistrationValues, (typeof registrationSecretFields)[number]>>;

export function saveRegistrationDraft(values: RegistrationValues) {
  const draft: Record<string, string> = {};
  for (const field of draftFields) draft[field] = values[field];
  writeStoredJSON("session", KEY, draft);
}

export function loadRegistrationDraft(): RegistrationDraft | null {
  const stored = readStoredJSON("session", KEY);
  if (typeof stored !== "object" || stored === null) return null;
  const draft: Record<string, string> = {};
  for (const field of draftFields) {
    const value = (stored as Record<string, unknown>)[field];
    if (typeof value === "string") draft[field] = value;
  }
  return Object.values(draft).some((value) => value.trim() !== "") ? draft : null;
}

export function clearRegistrationDraft() {
  removeStored("session", KEY);
}

/*
 * Whether the current form was restored from a draft. Kept as a tiny
 * external store so the registration form can read it during render.
 */
let restored = false;
const listeners = new Set<() => void>();

export const draftRestoredStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => restored,
  getServerSnapshot: () => false,
  set(value: boolean) {
    restored = value;
    listeners.forEach((listener) => listener());
  },
};
