"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { useElementSize } from "../hooks/useElementSize";
import { formatCount } from "../lib/format";
import type { Breakdown } from "../services/dashboard.types";
import { ChartTooltip, TooltipRow } from "./Tooltip";

type StackedBarsProps = {
  data: Breakdown;
  /** Fill per category id. */
  color: (id: string) => string;
  /** Text colour inside a filled segment, by category id: light or dark ink. */
  ink: (id: string) => "light" | "dark";
  /** What the counts are, for the total column ("graduates", "candidates"). */
  unit: string;
  label: string;
};

const LABEL_MIN_PX = 40;

/**
 * 100% stacked bars, one per row, separated by a 2px surface gap. A share is
 * printed inside its segment only when it fits; otherwise the tooltip and the
 * table carry it.
 */
export function StackedBars({ data, color, ink, unit, label }: StackedBarsProps) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const [hover, setHover] = useState<{ row: number; category: string | null } | null>(null);
  const hintId = useId();

  const totals = data.rows.map((row) => data.categories.reduce((t, c) => t + (row.values[c.id] ?? 0), 0));
  const shareOf = (row: number, id: string) => (totals[row] ? (data.rows[row].values[id] ?? 0) / totals[row] : 0);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, row: number) => {
    if (event.key === "Escape") setHover(null);
    const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = Math.min(data.rows.length - 1, Math.max(0, row + delta));
    (event.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  const describe = (row: number) =>
    totals[row]
      ? `${data.rows[row].label}, ${formatCount(totals[row])} ${unit}: ${data.categories
          .map((c) => `${c.label} ${Math.round(shareOf(row, c.id) * 100)}%`)
          .join(", ")}`
      : `${data.rows[row].label}: ${data.rows[row].note ?? "no data"}`;

  // Tooltip anchor: centre of the hovered segment, or of the bar on focus.
  const anchor = (() => {
    if (!hover || !totals[hover.row]) return null;
    let start = 0;
    let span = 1;
    if (hover.category) {
      for (const c of data.categories) {
        const s = shareOf(hover.row, c.id);
        if (c.id === hover.category) {
          span = s;
          break;
        }
        start += s;
      }
    }
    // Bars are 24px tall and centred in each row; anchor just above the bar.
    return { x: (start + span / 2) * width, y: hover.row * ROW_PITCH + (ROW_PITCH - 24) / 2 + 10 };
  })();

  return (
    <div>
      <p id={hintId} className="sr-only">
        Each row is focusable; use the up and down arrow keys to move between rows. The table view lists every value.
      </p>
      <p className="sr-only" aria-live="polite">
        {hover ? describe(hover.row) : ""}
      </p>
      <p aria-hidden="true" className="flex justify-end text-[12px] capitalize text-muted">
        {unit}
      </p>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4">
        <div className="grid" style={{ gridAutoRows: ROW_PITCH }}>
          {data.rows.map((row) => (
            <span key={row.id} title={row.label} className="flex min-w-20 max-w-32 items-center sm:max-w-48">
              <span className="truncate text-[13.5px] text-ink">{row.label}</span>
            </span>
          ))}
        </div>

        <div ref={ref} className="relative grid" style={{ gridAutoRows: ROW_PITCH }} aria-label={label} role="list">
          {data.rows.map((row, ri) => (
            <div
              key={row.id}
              role="listitem"
              tabIndex={0}
              aria-label={describe(ri)}
              aria-describedby={hintId}
              onFocus={() => setHover({ row: ri, category: null })}
              onBlur={() => setHover(null)}
              onKeyDown={(event) => onKeyDown(event, ri)}
              onPointerLeave={() => setHover(null)}
              className="flex items-center rounded-[5px]"
            >
              {totals[ri] ? (
                <div className="flex h-6 w-full gap-[2px]">
                  {data.categories.map((c) => {
                    const s = shareOf(ri, c.id);
                    if (s <= 0) return null;
                    const px = s * width;
                    const dimmed = hover?.row === ri && hover.category !== null && hover.category !== c.id;
                    return (
                      <div
                        key={c.id}
                        onPointerEnter={() => setHover({ row: ri, category: c.id })}
                        className={cn(
                          "chart-mark flex min-w-0 items-center justify-start rounded-[4px] px-2 text-[12px] font-medium tabular-nums transition-opacity duration-150",
                          ink(c.id) === "light" ? "text-white" : "text-ink",
                          dimmed && "opacity-55",
                        )}
                        style={{ flexGrow: s, flexBasis: 0, backgroundColor: color(c.id) }}
                      >
                        {px >= LABEL_MIN_PX ? `${Math.round(s * 100)}%` : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-6 w-full items-center rounded-[4px] border border-dashed border-line px-3 text-[12.5px] text-muted">
                  {row.note ?? "No data yet"}
                </div>
              )}
            </div>
          ))}

          {hover && anchor && width > 0 ? (
            <ChartTooltip x={anchor.x} y={anchor.y} bounds={width} title={`${data.rows[hover.row].label} · ${formatCount(totals[hover.row])} ${unit}`}>
              {data.categories.map((c) => (
                <TooltipRow
                  key={c.id}
                  shape="rect"
                  color={color(c.id)}
                  emphasis={hover.category === c.id}
                  value={`${Math.round(shareOf(hover.row, c.id) * 100)}%`}
                  label={`${c.label} (${formatCount(data.rows[hover.row].values[c.id] ?? 0)})`}
                />
              ))}
            </ChartTooltip>
          ) : null}
        </div>

        <div className="grid" style={{ gridAutoRows: ROW_PITCH }}>
          {data.rows.map((row, ri) => (
            <span key={row.id} className="flex items-center justify-end text-[13.5px] tabular-nums text-ink">
              {totals[ri] ? formatCount(totals[ri]) : "—"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ROW_PITCH = 44;
