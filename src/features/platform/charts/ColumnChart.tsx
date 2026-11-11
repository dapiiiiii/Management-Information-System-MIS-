"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useElementSize } from "../hooks/useElementSize";
import { formatCount } from "../lib/format";
import { clamp, zeroDomain } from "./scale";
import { ChartTooltip, TooltipRow } from "./Tooltip";

export type ColumnGroup = {
  id: string;
  label: string;
  /** Values per series id; null when not yet available. */
  values: Record<string, number | null>;
  /** Shown under the label and in the tooltip when a value is missing. */
  note?: string;
};

type ColumnChartProps = {
  groups: ColumnGroup[];
  series: Array<{ id: string; label: string; color: string }>;
  label: string;
  height?: number;
};

const M = { top: 12, right: 8, bottom: 44, left: 38 };
const BAR_MAX = 24;
const GAP = 2;

/** Grouped columns from a zero baseline: 4px rounded caps, square at the base. */
export function ColumnChart({ groups, series, label, height = 248 }: ColumnChartProps) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const hintId = useId();

  const n = groups.length;
  const max = Math.max(0, ...groups.flatMap((g) => Object.values(g.values).filter((v): v is number => v !== null)));
  const domain = zeroDomain(max);
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const band = n ? plotW / n : 0;
  const bar = Math.min(BAR_MAX, Math.max(6, (band * 0.56 - GAP * (series.length - 1)) / series.length));
  const groupW = bar * series.length + GAP * (series.length - 1);
  const y = (v: number) => M.top + plotH - (v / domain.max) * plotH;
  const base = M.top + plotH;

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!n || band <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setActive(clamp(Math.floor((event.clientX - rect.left - M.left) / band), 0, n - 1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? 0;
    const next =
      event.key === "ArrowRight" ? current + 1
      : event.key === "ArrowLeft" ? current - 1
      : event.key === "Home" ? 0
      : event.key === "End" ? n - 1
      : null;
    if (event.key === "Escape") setActive(null);
    if (next === null) return;
    event.preventDefault();
    setActive(clamp(next, 0, n - 1));
  };

  const describe = (g: ColumnGroup) =>
    `${g.label}: ${series.map((s) => `${s.label} ${g.values[s.id] === null ? (g.note ?? "not available") : formatCount(g.values[s.id] as number)}`).join(", ")}`;

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-roledescription="chart"
      aria-label={label}
      aria-describedby={hintId}
      onKeyDown={onKeyDown}
      onFocus={() => setActive((i) => i ?? 0)}
      onBlur={() => setActive(null)}
      className="relative rounded-md"
      style={{ height }}
    >
      <p id={hintId} className="sr-only">
        Use the left and right arrow keys to move between groups. The table view lists every value.
      </p>
      <p className="sr-only" aria-live="polite">
        {active === null ? "" : describe(groups[active])}
      </p>

      {width > 0 ? (
        <svg width={width} height={height} aria-hidden="true" className="block touch-pan-y" onPointerMove={onPointerMove} onPointerLeave={() => setActive(null)}>
          {domain.ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} stroke="var(--color-grid)" shapeRendering="crispEdges" />
              <text x={M.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[11.5px] tabular-nums">
                {formatCount(t)}
              </text>
            </g>
          ))}

          {groups.map((g, gi) => {
            const left = M.left + gi * band + (band - groupW) / 2;
            const dimmed = active !== null && active !== gi;
            return (
              <g key={g.id}>
                {active === gi ? <rect x={M.left + gi * band + 2} y={M.top} width={band - 4} height={plotH} rx={6} fill="var(--color-ink)" fillOpacity={0.035} /> : null}
                {series.map((s, si) => {
                  const v = g.values[s.id];
                  if (v === null || v === undefined || v <= 0) return null;
                  const top = y(v);
                  const h = base - top;
                  const r = Math.min(4, h, bar / 2);
                  const bx = left + si * (bar + GAP);
                  // Rounded data end, square at the baseline.
                  const d = `M${bx},${base}V${top + r}Q${bx},${top} ${bx + r},${top}H${bx + bar - r}Q${bx + bar},${top} ${bx + bar},${top + r}V${base}Z`;
                  return <path key={s.id} d={d} fill={s.color} className="chart-mark transition-opacity duration-150" opacity={dimmed ? 0.45 : 1} />;
                })}
                <text x={left + groupW / 2} y={base + 18} textAnchor="middle" className="fill-ink text-[12px]">
                  {band >= 68 ? g.label : g.label.replace("Cohort ", "")}
                </text>
                {g.note ? (
                  <text x={left + groupW / 2} y={base + 33} textAnchor="middle" className="fill-muted text-[11px]">
                    {g.note}
                  </text>
                ) : null}
              </g>
            );
          })}

          <line x1={M.left} x2={M.left + plotW} y1={base} y2={base} stroke="var(--color-axis)" shapeRendering="crispEdges" />
          <rect x={M.left} y={0} width={plotW} height={height} fill="transparent" />
        </svg>
      ) : null}

      {active !== null && width > 0 ? (
        <ChartTooltip
          x={M.left + active * band + band / 2}
          y={Math.min(...series.map((s) => { const v = groups[active].values[s.id]; return v ? y(v) : base; }))}
          bounds={width}
          title={groups[active].label}
        >
          {series.map((s) => {
            const v = groups[active].values[s.id];
            return (
              <TooltipRow
                key={s.id}
                color={s.color}
                shape="rect"
                value={v === null || v === undefined ? "—" : formatCount(v)}
                label={v === null || v === undefined ? `${s.label} (${(groups[active].note ?? "pending").toLowerCase()})` : s.label}
              />
            );
          })}
        </ChartTooltip>
      ) : null}
    </div>
  );
}
