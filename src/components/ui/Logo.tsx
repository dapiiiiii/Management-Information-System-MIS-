import { cn } from "@/lib/cn";

/**
 * The mark: a sun path rising from a horizon, with the sun partway along it.
 * It reads as both the solar subject and a journey in progress.
 */
export function LogoMark({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8 shrink-0", className)} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="7.5" fill={inverse ? "var(--color-paper)" : "var(--color-forest)"} />
      <path
        d="M8.5 21.5a7.5 7.5 0 0 1 15 0"
        fill="none"
        stroke={inverse ? "var(--color-forest)" : "var(--color-paper)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M7 21.5h18"
        stroke={inverse ? "var(--color-forest)" : "var(--color-paper)"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="21.3" cy="16.1" r="2.15" fill="var(--color-sun)" />
    </svg>
  );
}

export function Logo({ inverse = false, className }: { inverse?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark inverse={inverse} />
      <span className="flex items-baseline gap-1.5 text-[17px] leading-none tracking-[0.02em]">
        <span className={cn("font-semibold", inverse ? "text-paper" : "text-ink")}>TCE</span>
        <span className={cn("font-normal", inverse ? "text-paper/65" : "text-muted")}>MIS</span>
      </span>
    </span>
  );
}
