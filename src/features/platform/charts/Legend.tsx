import { cn } from "@/lib/cn";

export type LegendItem = { id: string; label: string; color: string };

/** Swatches mirror the mark: a short stroke for lines, a block for bars. */
export function Legend({ items, shape = "rect", className }: { items: LegendItem[]; shape?: "rect" | "line"; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted", className)}>
      {items.map((item) => (
        <li key={item.id} className="inline-flex items-center gap-2">
          <Swatch color={item.color} shape={shape} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/** Key for a reference line (a target), drawn dashed as on the chart. */
export function TargetKey({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-muted">
      <svg width="16" height="2" aria-hidden="true" className="shrink-0">
        <line x1="0" x2="16" y1="1" y2="1" stroke="var(--color-ink)" strokeOpacity={0.5} strokeWidth={1.5} strokeDasharray="4 3" />
      </svg>
      {label}
    </span>
  );
}

export function Swatch({ color, shape = "rect" }: { color: string; shape?: "rect" | "line" }) {
  return (
    <span
      aria-hidden="true"
      className={cn("chart-mark inline-block shrink-0", shape === "line" ? "h-[2px] w-3.5 rounded-full" : "h-2.5 w-2.5 rounded-[3px]")}
      style={{ backgroundColor: color }}
    />
  );
}
