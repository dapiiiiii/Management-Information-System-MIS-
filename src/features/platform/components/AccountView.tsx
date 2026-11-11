"use client";

import Link from "next/link";
import { Button, textLinkClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { initials } from "@/features/auth/components/AccountMenu";
import { authConfig } from "@/features/auth/config/auth.config";
import { roleLabels } from "@/features/auth/config/roles";
import { useAuth } from "@/features/auth/context/useAuth";
import { Panel } from "../charts/Panel";
import { formatDate } from "../lib/format";

/** Who is signed in, what access they hold, and how to end the session. */
export function AccountView() {
  const { user, session, signOut } = useAuth();
  if (!user || !session) return null;

  return (
    <div className="mx-auto w-full max-w-[1040px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest text-[17px] font-semibold tracking-[0.03em] text-paper"
        >
          {initials(user.fullName)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[clamp(1.75rem,1.45rem+1vw,2.375rem)] font-medium leading-[1.1] tracking-[-0.024em] font-stretch-semi-condensed text-ink">
            {user.fullName}
          </h1>
          <p className="mt-1 truncate text-[15px] text-muted">{user.email}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Access" description="What this account can use">
          <dl className="divide-y divide-line text-[14.5px]">
            <div className="flex justify-between gap-4 py-3 first:pt-0">
              <dt className="text-muted">Role</dt>
              <dd className="text-right font-medium text-ink">{roleLabels[user.role]}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-muted">Email</dt>
              <dd className="min-w-0 truncate text-right text-ink">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3 last:pb-0">
              <dt className="text-muted">Session ends</dt>
              <dd className="text-right text-ink">
                <time dateTime={session.expiresAt}>
                  {formatDate(session.expiresAt, "dayYear")}, {formatDate(session.expiresAt, "time")}
                </time>
              </dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2.5 rounded-lg bg-paper px-4 py-3 text-[13.5px] leading-snug text-muted">
            <Icon name="shieldCheck" className="mt-px h-4 w-4 shrink-0 text-forest" />
            Roles are assigned through controlled administration. To change yours, contact your programme administrator.
          </p>
        </Panel>

        <Panel title="Security" description="Password and sign-in">
          <div className="space-y-6">
            <div>
              <p className="text-[14.5px] font-medium text-ink">Password</p>
              <p className="mt-1 text-[13.5px] leading-snug text-muted">
                To change your password, request reset instructions for this account.{" "}
                <Link href={authConfig.routes.forgotPassword} className={textLinkClassName}>
                  Reset password
                </Link>
              </p>
            </div>
            <div className="border-t border-line pt-6">
              <p className="text-[14.5px] font-medium text-ink">Sign out</p>
              <p className="mt-1 text-[13.5px] leading-snug text-muted">
                Ends this session and clears information stored by the platform in this browser.
              </p>
              <Button
                variant="secondary"
                size="md"
                className="mt-4"
                onClick={() => void signOut({ redirectTo: authConfig.routes.login })}
              >
                <Icon name="logOut" className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
