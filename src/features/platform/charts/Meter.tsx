import { cn } from "@/lib/cn";

type MeterProps = {
  /** 0 to 100. */
  value: number;
  /** Optional target, 0 to 100, drawn as a tick. */
  target?: number;
  /** Accessible name, e.g. "Cohort G curriculum delivered". */
  label: string;
  tone?: "forest" | "sun";
  className?: string;
};

/** A progress track: forest fill on a lighter step of the same hue. */
export function Meter({ value, target, label, tone = "forest", className }: MeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-valuetext={`${Math.round(clamped)}%${target !== undefined ? `, target ${target}%` : ""}`}
      className={cn("relative h-1.5 rounded-full", tone === "sun" ? "bg-sun/20" : "bg-forest/10", className)}
    >
      <div
        className={cn(
          "chart-mark h-full rounded-full transition-[width] duration-700 ease-(--ease-out-soft)",
          tone === "sun" ? "bg-sun-strong" : "bg-forest",
        )}
        style={{ width: `${clamped}%` }}
      />
      {target !== undefined ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -top-1 w-[2px] -translate-x-1/2 rounded-full bg-ink/60 ring-2 ring-surface"
          style={{ left: `${target}%` }}
        />
      ) : null}
    </div>
  );
}
