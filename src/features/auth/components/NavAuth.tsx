"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { authConfig } from "../config/auth.config";
import { roleHomeRoute, roleLabels } from "../config/roles";
import { useAuth } from "../context/useAuth";
import { AccountMenu, initials } from "./AccountMenu";

const { routes } = authConfig;

/**
 * Navbar auth controls. While the session is being read they render an
 * empty, fixed-width slot, so the bar never shows the wrong state and does
 * not shift when the controls appear.
 */
export function NavAuthControls({ tone }: { tone: "light" | "dark" }) {
  const { status, user } = useAuth();
  const dark = tone === "dark";

  return (
    <div className="hidden min-w-[232px] items-center justify-end sm:flex">
      {status === "unauthenticated" ? (
        <div className="flex animate-[fade_200ms_ease-out_both] items-center gap-2">
          <ButtonLink href={routes.login} variant={dark ? "inverseOutline" : "secondary"} size="sm">
            Sign In
          </ButtonLink>
          <ButtonLink href={routes.register} variant={dark ? "inverse" : "primary"} size="sm">
            Create Account
          </ButtonLink>
        </div>
      ) : null}
      {status === "authenticated" && user ? (
        <div className="flex animate-[fade_200ms_ease-out_both] items-center gap-2">
          <ButtonLink href={roleHomeRoute[user.role]} variant={dark ? "inverse" : "primary"} size="sm">
            Access Platform
          </ButtonLink>
          <AccountMenu tone={tone} />
        </div>
      ) : null}
    </div>
  );
}

/** The same choices for the mobile menu. */
export function MobileNavAuth({ onNavigate }: { onNavigate: () => void }) {
  const { status, user, signOut } = useAuth();

  if (status === "unauthenticated") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <ButtonLink href={routes.register} size="lg" onClick={onNavigate}>
          Create Account
        </ButtonLink>
        <ButtonLink href={routes.login} variant="secondary" size="lg" onClick={onNavigate}>
          Sign In
        </ButtonLink>
      </div>
    );
  }

  if (status === "authenticated" && user) {
    const home = roleHomeRoute[user.role];
    return (
      <div>
        <div className="mb-5 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-[13px] font-semibold text-paper"
          >
            {initials(user.fullName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium text-ink">{user.fullName}</p>
            <p className="truncate text-[13px] text-muted">{roleLabels[user.role]}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <ButtonLink href={home} size="lg" onClick={onNavigate}>
            Access Platform
          </ButtonLink>
          <ButtonLink href={`${home}/account`} variant="secondary" size="lg" onClick={onNavigate}>
            Account
          </ButtonLink>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              onNavigate();
              void signOut();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
