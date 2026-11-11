"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { authConfig } from "@/features/auth/config/auth.config";
import type { Role } from "@/features/auth/config/roles";
import { useAuth } from "@/features/auth/context/useAuth";
import { MODULES, modulesFor, platformRoutes } from "../../config/modules";

type Command = {
  id: string;
  label: string;
  hint: string;
  group: "Go to" | "Account";
  icon: IconName;
  run: () => void;
};

/**
 * Ctrl/⌘ K: jump to any part of the platform the role can reach. A native
 * modal dialog (focus is contained, Escape closes) with a combobox and
 * listbox, so it works the same by keyboard and by screen reader.
 */
export function CommandMenu({ role, open, onClose }: { role: Role; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const optionId = (i: number) => `${listId}-option-${i}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    return [
      { id: "overview", label: "Overview", hint: "Your workspace at a glance", group: "Go to", icon: "grid", run: go(platformRoutes.overview(role)) },
      ...modulesFor(role).map((id): Command => ({
        id,
        label: MODULES[id].label,
        hint: MODULES[id].description,
        group: "Go to",
        icon: MODULES[id].icon,
        run: go(platformRoutes.module(role, id)),
      })),
      { id: "account", label: "Account", hint: "Your details and session", group: "Account", icon: "user", run: go(platformRoutes.account(role)) },
      { id: "home", label: "Public homepage", hint: "Leave the platform", group: "Account", icon: "arrowLeft", run: go("/") },
      {
        id: "sign-out",
        label: "Sign out",
        hint: "End this session on this device",
        group: "Account",
        icon: "logOut",
        run: () => void signOut({ redirectTo: authConfig.routes.login }),
      },
    ];
  }, [role, router, signOut]);

  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? commands.filter((c) => c.label.toLowerCase().includes(normalized) || c.hint.toLowerCase().includes(normalized))
    : commands;
  const safeIndex = Math.min(activeIndex, Math.max(0, results.length - 1));

  const close = () => {
    onClose();
    setQuery("");
    setActiveIndex(0);
  };

  const choose = (command: Command | undefined) => {
    if (!command) return;
    close();
    command.run();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((safeIndex + step + results.length) % Math.max(1, results.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[safeIndex]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search the platform"
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="platform-dialog fixed inset-x-0 top-[12vh] mx-auto w-[min(36rem,calc(100vw-2rem))]"
    >
      <div className="platform-scope overflow-hidden rounded-xl border border-line bg-surface text-ink shadow-device">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" className="h-5 w-5 shrink-0 text-muted" />
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results.length ? optionId(safeIndex) : undefined}
            aria-label="Search the platform"
            placeholder="Search modules and actions…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            className="h-14 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-muted focus-visible:outline-none"
          />
          <kbd className="hidden rounded border border-line bg-paper px-1.5 py-0.5 text-[11.5px] text-muted sm:inline">Esc</kbd>
        </div>

        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          {results.map((command, i) => {
            const heading = i === 0 || results[i - 1].group !== command.group ? command.group : null;
            return (
              <li key={command.id} role="presentation">
                {heading ? (
                  <p role="presentation" className="px-3 pb-1.5 pt-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-muted first:pt-1">
                    {heading}
                  </p>
                ) : null}
                <div
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === safeIndex}
                  onPointerMove={() => setActiveIndex(i)}
                  onClick={() => choose(command)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5",
                    i === safeIndex ? "bg-paper-2" : "hover:bg-paper",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-forest">
                    <Icon name={command.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-medium text-ink">{command.label}</span>
                    <span className="block truncate text-[13px] text-muted">{command.hint}</span>
                  </span>
                  {i === safeIndex ? <Icon name="arrowRight" className="ml-auto h-4 w-4 shrink-0 text-muted" /> : null}
                </div>
              </li>
            );
          })}
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-8 text-center text-[14px] text-muted">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </li>
          ) : null}
        </ul>
      </div>
    </dialog>
  );
}
