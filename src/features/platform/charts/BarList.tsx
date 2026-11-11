import { cn } from "@/lib/cn";
import { formatValue } from "../lib/format";
import type { RankedItem, ValueFormat } from "../services/dashboard.types";

type BarListProps = {
  items: RankedItem[];
  format: ValueFormat;
  /** Colour per item id; defaults to the first series colour. */
  color?: (id: string) => string;
  /** Upper end of the scale; defaults to the largest value (100 for rates). */
  max?: number;
  /** A reference mark drawn across every row, e.g. a target. */
  target?: { value: number; label: string };
  /** Show each item's share of the total after its value. */
  showShare?: boolean;
  label: string;
};

/**
 * Horizontal bars on one baseline, values printed at the tip, so the list
 * reads without hover. Thin marks, square at the baseline, 4px rounded end.
 */
export function BarList({ items, format, color, max, target, showShare, label }: BarListProps) {
  const total = items.reduce((t, item) => t + item.value, 0);
  const top = max ?? (format === "percent" ? 100 : Math.max(1, ...items.map((i) => i.value)));
  const at = (v: number) => `${Math.min(100, (v / top) * 100)}%`;

  return (
    <div>
      <ul aria-label={label} className="space-y-3.5">
        {items.map((item) => {
          const share = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <li key={item.id} className="group">
              <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                <span className="min-w-0 truncate text-ink">{item.label}</span>
                <span className="shrink-0 tabular-nums">
                  <span className="font-medium text-ink">{formatValue(item.value, format)}</span>
                  {showShare ? <span className="ml-1.5 text-muted">{share}%</span> : null}
                </span>
              </div>
              <div className="relative mt-1.5 h-2 rounded-r-[4px] bg-paper-2">
                <div
                  className={cn("chart-mark h-full rounded-r-[4px] transition-[width,filter] duration-500 ease-(--ease-out-soft) group-hover:brightness-90")}
                  style={{ width: item.value > 0 ? at(item.value) : 0, backgroundColor: color?.(item.id) ?? "var(--color-series-1)" }}
                />
                {target ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -bottom-1 w-[2px] -translate-x-1/2 rounded-full bg-ink/55"
                    style={{ left: at(target.value) }}
                  />
                ) : null}
              </div>
              {item.detail ? <p className="mt-1 text-[12.5px] text-muted">{item.detail}</p> : null}
            </li>
          );
        })}
      </ul>
      {target ? (
        <p className="mt-4 flex items-center gap-2 text-[12.5px] text-muted">
          <span aria-hidden="true" className="inline-block h-3 w-[2px] rounded-full bg-ink/55" />
          {target.label}
        </p>
      ) : null}
    </div>
  );
}
