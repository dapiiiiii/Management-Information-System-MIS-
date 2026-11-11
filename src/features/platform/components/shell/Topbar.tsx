"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { AccountMenu } from "@/features/auth/components/AccountMenu";
import type { Role } from "@/features/auth/config/roles";
import { isModuleId, MODULES, platformRoutes } from "../../config/modules";

const noop = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** Where the visitor is, in words: "Overview", a module name, or "Account". */
function currentTitle(role: Role, pathname: string): string {
  const base = platformRoutes.overview(role);
  const segment = pathname.slice(base.length + 1).split("/")[0];
  if (!segment) return "Overview";
  if (segment === "account") return "Account";
  return isModuleId(segment) ? MODULES[segment].label : "Platform";
}

export function Topbar({
  role,
  onOpenMenu,
  onOpenSearch,
}: {
  role: Role;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  const pathname = usePathname();
  const apple = useSyncExternalStore(noop, isApple, () => false);
  const title = currentTitle(role, pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="-ml-1.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-ink/5 lg:hidden"
        >
          <span className="sr-only">Open navigation</span>
          <Icon name="menu" className="h-6 w-6" />
        </button>

        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 text-[14px]">
            <li className="hidden sm:block">
              <Link href={platformRoutes.overview(role)} className="rounded-sm text-muted transition-colors hover:text-ink">
                Platform
              </Link>
            </li>
            <li aria-hidden="true" className="hidden text-line sm:block">
              <Icon name="chevronRight" className="h-4 w-4 text-field" />
            </li>
            <li className="truncate font-medium text-ink" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-keyshortcuts={apple ? "Meta+K" : "Control+K"}
            className="inline-flex h-10 items-center gap-2.5 rounded-md border border-line bg-surface px-3 text-[14px] text-muted transition-colors hover:border-ink/25 hover:text-ink md:w-64"
          >
            <Icon name="search" className="h-[18px] w-[18px] shrink-0" />
            <span className="hidden md:inline">Search the platform</span>
            <span className="sr-only md:hidden">Search the platform</span>
            <kbd aria-hidden="true" className="ml-auto hidden rounded border border-line bg-paper px-1.5 py-0.5 font-sans text-[11.5px] text-muted md:inline">
              {apple ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
