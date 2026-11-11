import { authConfig } from "../config/auth.config";

type Area = "session" | "local";

/** Storage can be unavailable (private mode, blocked site data); every call tolerates that. */
function area(kind: Area): Storage | null {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredJSON(kind: Area, key: string): unknown {
  try {
    const raw = area(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    return null;
  }
}

export function writeStoredJSON(kind: Area, key: string, value: unknown) {
  try {
    area(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage blocked: drafts are a convenience only.
  }
}

export function removeStored(kind: Area, key: string) {
  try {
    area(kind)?.removeItem(key);
  } catch {
    // Ignore: nothing to clear.
  }
}

/** Removes every key this app has written, in both storage areas. Used on sign-out. */
export function clearAppStorage() {
  for (const kind of ["session", "local"] as const) {
    const store = area(kind);
    if (!store) continue;
    try {
      const keys = Array.from({ length: store.length }, (_, i) => store.key(i)).filter(
        (key): key is string => key?.startsWith(authConfig.storagePrefix) ?? false,
      );
      keys.forEach((key) => store.removeItem(key));
    } catch {
      // Ignore: storage became unavailable.
    }
  }
}
