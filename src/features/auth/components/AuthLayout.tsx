"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import trainingLab from "@/assets/solar-training-lab.jpg";
import { legalLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { authConfig } from "../config/auth.config";

const { routes } = authConfig;

const brandCopy: Record<string, { heading: string; body: string }> = {
  [routes.login]: {
    heading: "Welcome back.",
    body: "Securely access the programme platform to manage training, certification, employment outcomes and programme information.",
  },
  [routes.register]: {
    heading: "Begin your training journey.",
    body: "Register as a trainee to take part in the programme. Your record follows you from enrollment through training, assessment and certification.",
  },
  [routes.forgotPassword]: {
    heading: "Regain access.",
    body: "Request instructions to reset your password and return to the programme platform.",
  },
  [routes.resetPassword]: {
    heading: "Choose a new password.",
    body: "Set a new password to protect your account, then sign in to continue.",
  },
};

const footerLinks = legalLinks.filter((link) => link.label !== "Platform Access");

export function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const copy = brandCopy[pathname] ?? brandCopy[routes.login];

  return (
    <div className="auth-scope min-h-svh bg-paper lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Brand and trust panel: a slim banner on small screens, a full column on large */}
      <aside className="on-dark relative isolate flex h-36 flex-col justify-between overflow-hidden bg-forest-deep px-5 py-4 text-paper sm:h-40 sm:px-8 lg:sticky lg:top-0 lg:h-svh lg:px-12 lg:py-10 xl:px-16 xl:py-12">
        <Image
          src={trainingLab}
          alt=""
          fill
          sizes="(min-width: 1024px) 47vw, 100vw"
          placeholder="blur"
          className="-z-20 object-cover object-[60%_42%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-forest-deep/80 lg:bg-linear-to-t lg:from-forest-deep lg:from-25% lg:via-forest-deep/80 lg:to-forest-deep/50"
        />

        <div className="flex items-center justify-between gap-4">
          <Link href={routes.home} className="rounded-md" aria-label={`${site.shortName} homepage`}>
            <Logo inverse />
          </Link>
          <BackToHomepage className="text-paper/80 hover:text-paper lg:hidden" />
        </div>

        <div className="max-w-[30rem]">
          <p className="text-[11.5px] font-medium tracking-[0.14em] text-paper/75 sm:text-[12.5px] sm:tracking-[0.18em]">
            TRAINING <span aria-hidden="true" className="px-1 text-sun">•</span> CERTIFICATION{" "}
            <span aria-hidden="true" className="px-1 text-sun">•</span> EMPLOYMENT
          </p>
          <div key={pathname} className="hidden animate-auth-enter lg:block">
            <p className="mt-6 text-[clamp(2.5rem,1.4rem+2.4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.028em] font-stretch-semi-condensed">
              {copy.heading}
            </p>
            <p className="mt-5 max-w-[42ch] text-body text-paper/75">{copy.body}</p>
          </div>
          <SecurityNote tone="dark" className="mt-10 hidden border-t border-paper/15 pt-6 lg:flex" />
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-[calc(100svh-9rem)] flex-col lg:min-h-svh">
        <div className="hidden h-20 items-center justify-end px-12 lg:flex">
          <BackToHomepage className="text-muted hover:text-ink" />
        </div>

        <main id="main" className="flex flex-1 items-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-6">
          <div className="mx-auto w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="px-5 pb-8 sm:px-8 lg:px-12">
          <SecurityNote tone="light" className="mx-auto mb-8 max-w-[420px] border-t border-line pt-6 lg:hidden" />
          <div className="mx-auto flex max-w-[420px] flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[13px] text-muted lg:mx-0 lg:max-w-none lg:justify-end">
            <p>
              &copy; {site.copyrightYear} {site.shortName}
            </p>
            <nav aria-label="Legal">
              <ul className="flex gap-1">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="inline-flex min-h-11 items-center px-2 hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}

function BackToHomepage({ className }: { className?: string }) {
  return (
    <Link
      href={routes.home}
      className={cn("inline-flex min-h-11 items-center gap-2 rounded-md text-[14px] transition-colors", className)}
    >
      <Icon name="arrowLeft" className="h-4 w-4" />
      Back to homepage
    </Link>
  );
}

/** Restrained security microcopy: no claims beyond controlled access. */
function SecurityNote({ className, tone }: { className?: string; tone: "dark" | "light" }) {
  return (
    <div className={cn("flex items-start gap-3", tone === "dark" ? "text-paper" : "text-ink", className)}>
      <Icon
        name="lock"
        className={cn("mt-0.5 h-5 w-5 shrink-0", tone === "dark" ? "text-sun" : "text-sun-strong")}
        strokeWidth={1.75}
      />
      <div>
        <p className="text-[14.5px] font-medium">Secure platform access</p>
        <p className={cn("mt-1 text-[13.5px] leading-snug", tone === "dark" ? "text-paper/65" : "text-muted")}>
          Your information is handled through controlled account access.
        </p>
      </div>
    </div>
  );
}
