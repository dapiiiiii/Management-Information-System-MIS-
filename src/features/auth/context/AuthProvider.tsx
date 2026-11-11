"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clearAppStorage } from "../lib/storage";
import { authService, type AuthUser, type LoginInput, type Session } from "../services/auth.service";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthContextValue = {
  /** "loading" until the session is known; UI should render neutrally until then. */
  status: AuthStatus;
  session: Session | null;
  user: AuthUser | null;
  signIn: (input: LoginInput) => Promise<Session>;
  /** Clears local state immediately, then ends the server session. */
  signOut: (options?: { redirectTo?: string }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type State = { status: AuthStatus; session: Session | null };

const SIGNED_OUT: State = { status: "unauthenticated", session: null };
const CHANNEL = "tce-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading", session: null });
  const channel = useRef<BroadcastChannel | null>(null);

  const syncSession = useCallback(async () => {
    try {
      const session = await authService.getSession();
      setState(session ? { status: "authenticated", session } : SIGNED_OUT);
    } catch {
      setState(SIGNED_OUT);
    }
  }, []);

  useEffect(() => {
    void syncSession();

    // Pages restored from the back/forward cache must re-check the session,
    // so nothing protected reappears after signing out.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void syncSession();
    };
    window.addEventListener("pageshow", onPageShow);

    // Keep other tabs in step with sign-in and sign-out.
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = () => void syncSession();
      channel.current = bc;
    }

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      channel.current?.close();
      channel.current = null;
    };
  }, [syncSession]);

  const signIn = useCallback(async (input: LoginInput) => {
    const session = await authService.login(input);
    setState({ status: "authenticated", session });
    channel.current?.postMessage("changed");
    return session;
  }, []);

  const signOut = useCallback(
    async ({ redirectTo }: { redirectTo?: string } = {}) => {
      setState(SIGNED_OUT);
      clearAppStorage();
      try {
        await authService.logout();
      } catch {
        // Local state is already cleared; the server session will lapse on its own.
      }
      channel.current?.postMessage("changed");
      if (redirectTo) router.replace(redirectTo);
      router.refresh(); // drop cached route payloads rendered while signed in
    },
    [router],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      session: state.session,
      user: state.session?.user ?? null,
      signIn,
      signOut,
    }),
    [state, signIn, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
