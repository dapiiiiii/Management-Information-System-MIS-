"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { authConfig } from "../config/auth.config";
import { roleHomeRoute, roleLabels } from "../config/roles";
import { useAuth } from "../context/useAuth";

function menuItems(panel: HTMLElement | null) {
  return Array.from(panel?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")).toUpperCase();
}

/** Compact account menu: who is signed in, Account, Platform and Sign Out. */
export function AccountMenu({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    menuItems(panelRef.current)[0]?.focus();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!user) return null;
  const home = roleHomeRoute[user.role];

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = menuItems(panelRef.current);
    const index = list.indexOf(document.activeElement as HTMLElement);
    const move = (next: number) => {
      event.preventDefault();
      list[(next + list.length) % list.length]?.focus();
    };
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(list.length - 1);
    else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "Tab") close(false);
  };

  const onSignOut = () => {
    close(false);
    void signOut({ redirectTo: pathname.startsWith("/app") ? authConfig.routes.login : undefined });
  };

  const dark = tone === "dark";

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "flex h-11 items-center gap-1.5 rounded-full pl-1 pr-2 transition-colors",
          dark ? "text-paper hover:bg-paper/10" : "text-ink hover:bg-ink/5",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-[12.5px] font-semibold tracking-[0.03em]",
            dark ? "bg-paper text-forest-deep" : "bg-forest text-paper",
          )}
        >
          {initials(user.fullName)}
        </span>
        <Icon name="chevronDown" className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        <span className="sr-only">Account menu for {user.fullName}</span>
      </button>

      <div
        ref={panelRef}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-line bg-surface p-1.5 text-ink shadow-float"
      >
        <div className="px-3 pb-3 pt-2.5">
          <p className="truncate text-[14.5px] font-medium">{user.fullName}</p>
          <p className="truncate text-[13px] text-muted">{user.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-forest/[0.07] px-2.5 py-0.5 text-[12px] font-medium text-forest">
            {roleLabels[user.role]}
          </p>
        </div>
        <div id={menuId} role="menu" aria-label="Account" onKeyDown={onMenuKeyDown} className="border-t border-line pt-1.5">
          <MenuLink href={`${home}/account`} icon="user" onSelect={() => close(false)}>
            Account
          </MenuLink>
          <MenuLink href={home} icon="grid" onSelect={() => close(false)}>
            Platform
          </MenuLink>
          <div role="separator" className="my-1.5 h-px bg-line" />
          <button type="button" role="menuitem" tabIndex={-1} onClick={onSignOut} className={menuItemClassName}>
            <Icon name="logOut" className="h-[18px] w-[18px] text-muted" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

const menuItemClassName =
  "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-[14.5px] text-ink outline-none transition-colors hover:bg-paper-2 focus-visible:bg-paper-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest";

function MenuLink({
  href,
  icon,
  onSelect,
  children,
}: {
  href: string;
  icon: IconName;
  onSelect: () => void;
  children: string;
}) {
  return (
    <Link href={href} role="menuitem" tabIndex={-1} onClick={onSelect} className={menuItemClassName}>
      <Icon name={icon} className="h-[18px] w-[18px] text-muted" />
      {children}
    </Link>
  );
}
