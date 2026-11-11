"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { roleLabels, type Role } from "@/features/auth/config/roles";
import { MODULES, platformRoutes, roleNavigation } from "../../config/modules";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

/**
 * The platform's primary navigation, shared by the desktop sidebar and the
 * mobile drawer. Only the modules a role works with are listed.
 */
export function SidebarNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const overview = platformRoutes.overview(role);

  return (
    <div className="on-dark flex h-full flex-col bg-forest-deep text-paper">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/" className="rounded-md" aria-label="TCE MIS homepage" onClick={onNavigate}>
          <Logo inverse />
        </Link>
      </div>

      <div className="mx-3 mb-2 rounded-lg border border-paper/10 bg-paper/[0.04] px-3 py-2.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-paper/50">Workspace</p>
        <p className="mt-0.5 truncate text-[14px] font-medium text-paper">{roleLabels[role]}</p>
      </div>

      <nav aria-label="Platform" className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5 pt-2">
          <NavItem href={overview} icon="grid" label="Overview" active={pathname === overview} onNavigate={onNavigate} />
        </ul>
        {roleNavigation[role].map((section) => (
          <div key={section.label} className="mt-6">
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-paper/45">{section.label}</p>
            <ul className="space-y-0.5">
              {section.modules.map((id) => {
                const href = platformRoutes.module(role, id);
                return (
                  <NavItem
                    key={id}
                    href={href}
                    icon={MODULES[id].icon}
                    label={MODULES[id].label}
                    active={pathname === href}
                    onNavigate={onNavigate}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-paper/10 px-3 py-3">
        <ul>
          <NavItem
            href={platformRoutes.account(role)}
            icon="user"
            label="Account"
            active={pathname === platformRoutes.account(role)}
            onNavigate={onNavigate}
          />
        </ul>
        <ConnectionNote />
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: IconName;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          "group relative flex h-10 items-center gap-3 rounded-md px-3 text-[14px] transition-colors duration-150",
          active ? "bg-paper/[0.09] text-paper" : "text-paper/70 hover:bg-paper/[0.05] hover:text-paper",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-2 left-0 w-[2px] rounded-full bg-sun transition-opacity duration-200",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <Icon name={icon} className={cn("h-[18px] w-[18px] shrink-0", active ? "text-sun" : "text-paper/55 group-hover:text-paper/80")} />
        <span className="truncate">{label}</span>
        <PendingHint />
      </Link>
    </li>
  );
}

/** A fixed-size hint that fades in only while a navigation is still pending. */
function PendingHint() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-sun transition-opacity duration-200",
        pending ? "animate-shimmer opacity-100" : "opacity-0",
      )}
    />
  );
}

function ConnectionNote() {
  const online = useOnlineStatus();
  return (
    <p role="status" className="mt-2 flex items-start gap-2.5 px-3 text-[12.5px] leading-snug text-paper/55">
      <span
        aria-hidden="true"
        className={cn("mt-[5px] h-2 w-2 shrink-0 rounded-full", online ? "bg-stage-1" : "bg-sun")}
      />
      {online ? "Connected" : "Offline. Figures shown are the last ones loaded."}
    </p>
  );
}
