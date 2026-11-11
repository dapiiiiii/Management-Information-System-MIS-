"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { roleHomeRoute, type Role } from "@/features/auth/config/roles";
import { useAuth } from "@/features/auth/context/useAuth";
import { loginPathFor } from "@/features/auth/lib/redirects";
import { CommandMenu } from "./CommandMenu";
import { SidebarNav } from "./SidebarNav";
import { Topbar } from "./Topbar";

/**
 * The signed-in application frame: sidebar, top bar and content.
 *
 * The proxy already turns away requests without a session; this guard also
 * covers client-side navigation and pages restored after signing out, and it
 * sends an account to its own role's area. Nothing inside renders (or loads
 * data) until the session matches. Authorization stays with the backend.
 */
export function PlatformShell({ role, children }: { role: Role; children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const allowed = status === "authenticated" && user?.role === role;

  useEffect(() => {
    if (status === "unauthenticated") router.replace(loginPathFor(pathname));
    else if (status === "authenticated" && user && user.role !== role) router.replace(roleHomeRoute[user.role]);
  }, [status, user, role, router, pathname]);

  // Ctrl/⌘ K opens the command menu from anywhere in the platform.
  useEffect(() => {
    if (!allowed) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allowed]);

  if (!allowed || !user) {
    return (
      <main id="main" className="flex min-h-svh items-center justify-center bg-paper">
        <p role="status" className="flex items-center gap-3 text-small text-muted">
          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin text-forest" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
            <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Checking your session…
        </p>
      </main>
    );
  }

  return (
    <div className="platform-scope min-h-svh bg-paper lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-forest focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-svh lg:block">
        <SidebarNav role={role} />
      </aside>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        <SidebarNav role={role} onNavigate={closeDrawer} />
      </MobileDrawer>

      <div className="flex min-w-0 flex-col">
        <Topbar role={role} onOpenMenu={() => setDrawerOpen(true)} onOpenSearch={() => setCommandOpen(true)} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
      </div>

      <CommandMenu role={role} open={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}

/** The sidebar as a modal side sheet below the large breakpoint. */
function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Close if the layout widens to show the permanent sidebar.
  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => event.matches && onClose();
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <dialog
      ref={ref}
      aria-label="Platform navigation"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="platform-dialog platform-drawer fixed inset-y-0 left-0 m-0 h-svh w-[min(18.5rem,86vw)] lg:hidden"
    >
      <div className="relative h-full shadow-device">
        {children}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-md text-paper/80 hover:bg-paper/10 hover:text-paper focus-visible:outline-sun"
        >
          <span className="sr-only">Close navigation</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
