"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useElementSize } from "../hooks/useElementSize";
import { formatDate, formatValue, parseDate } from "../lib/format";
import type { ValueFormat } from "../services/dashboard.types";
import { clamp, lineDomain } from "./scale";
import { ChartTooltip, TooltipRow } from "./Tooltip";

export type LineSeries = { id: string; label: string; values: Array<number | null>; color: string };

type LineChartProps = {
  /** ISO dates, oldest first. */
  points: string[];
  granularity: "month" | "week";
  series: LineSeries[];
  format: ValueFormat;
  /** A reference line, e.g. a programme target. Pair it with a TargetKey in the legend. */
  target?: { value: number };
  label: string;
  height?: number;
};

const M = { top: 14, right: 46, bottom: 30, left: 38 };

function pointLabel(iso: string, granularity: "month" | "week", long = false): string {
  if (granularity === "week") return long ? `Week of ${formatDate(iso, "dayYear")}` : formatDate(iso, "day");
  if (long) return formatDate(iso, "longMonthYear");
  const d = parseDate(iso);
  return d.getMonth() === 0 ? formatDate(iso, "monthYear") : formatDate(iso, "month");
}

/** Splits a series into drawable runs, leaving gaps where values are missing. */
function segments(values: Array<number | null>): Array<Array<[number, number]>> {
  const runs: Array<Array<[number, number]>> = [];
  let run: Array<[number, number]> = [];
  values.forEach((value, i) => {
    if (value === null) {
      if (run.length) runs.push(run);
      run = [];
    } else run.push([i, value]);
  });
  if (run.length) runs.push(run);
  return runs;
}

export function LineChart({ points, granularity, series, format, target, label, height = 248 }: LineChartProps) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const hintId = useId();

  const n = points.length;
  const values = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
  const domain = lineDomain(values, format, target?.value);
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = height - M.top - M.bottom;
  const x = (i: number) => M.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => M.top + plotH - ((v - domain.min) / (domain.max - domain.min || 1)) * plotH;
  const fmt = (v: number) => formatValue(v, format);

  // Thin the x-axis labels so they never collide; always keep the first one.
  const labelEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 62))));
  const single = series.length === 1;

  // End labels only when every series ends on the last point and they sit apart.
  const ends = series.map((s) => {
    const last = s.values.at(-1);
    return last === null || last === undefined ? null : y(last);
  });
  const endLabels = ends.every((v) => v !== null) && ends.every((a, i) => ends.every((b, j) => i === j || Math.abs((a ?? 0) - (b ?? 0)) >= 16));

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (n === 0 || plotW <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    setActive(clamp(Math.round(((px - M.left) / plotW) * (n - 1)), 0, n - 1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? n - 1;
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

  const readout =
    active === null
      ? ""
      : `${pointLabel(points[active], granularity, true)}: ${series
          .map((s) => `${s.label} ${s.values[active] === null ? "no data" : fmt(s.values[active] as number)}`)
          .join(", ")}`;

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-roledescription="chart"
      aria-label={label}
      aria-describedby={hintId}
      onKeyDown={onKeyDown}
      onFocus={() => setActive((i) => i ?? n - 1)}
      onBlur={() => setActive(null)}
      className="relative rounded-md"
      style={{ height }}
    >
      <p id={hintId} className="sr-only">
        Use the left and right arrow keys to read each point. The table view lists every value.
      </p>
      <p className="sr-only" aria-live="polite">
        {readout}
      </p>

      {width > 0 ? (
        <svg
          width={width}
          height={height}
          aria-hidden="true"
          className="block touch-pan-y overflow-visible"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
        >
          {/* Grid and y-axis */}
          {domain.ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={M.left + plotW} y1={y(t)} y2={y(t)} stroke="var(--color-grid)" strokeWidth={1} shapeRendering="crispEdges" />
              <text x={M.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[11.5px] tabular-nums">
                {fmt(t)}
              </text>
            </g>
          ))}
          <line x1={M.left} x2={M.left + plotW} y1={M.top + plotH} y2={M.top + plotH} stroke="var(--color-axis)" shapeRendering="crispEdges" />

          {/* X-axis labels */}
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={p} x={x(i)} y={M.top + plotH + 19} textAnchor={i === 0 && n > 1 ? "start" : "middle"} className="fill-muted text-[11.5px]">
                {pointLabel(p, granularity)}
              </text>
            ) : null,
          )}

          {/* Target: keyed in the legend (TargetKey), so its label never collides with the data */}
          {target ? (
            <line
              x1={M.left}
              x2={M.left + plotW}
              y1={y(target.value)}
              y2={y(target.value)}
              stroke="var(--color-ink)"
              strokeOpacity={0.45}
              strokeDasharray="4 4"
              shapeRendering="crispEdges"
            />
          ) : null}

          {/* Series */}
          {series.map((s) =>
            segments(s.values).map((run, r) => {
              const d = run.map(([i, v], k) => `${k ? "L" : "M"}${x(i)},${y(v)}`).join("");
              const area =
                single && run.length > 1
                  ? `${d}L${x(run[run.length - 1][0])},${M.top + plotH}L${x(run[0][0])},${M.top + plotH}Z`
                  : null;
              return (
                <g key={`${s.id}-${r}`} className="chart-mark">
                  {area ? <path d={area} fill={s.color} fillOpacity={0.09} /> : null}
                  <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                </g>
              );
            }),
          )}

          {/* End markers and labels */}
          {series.map((s) => {
            const lastIndex = s.values.findLastIndex((v) => v !== null);
            if (lastIndex < 0) return null;
            const v = s.values[lastIndex] as number;
            return (
              <g key={`${s.id}-end`} className="chart-mark">
                <circle cx={x(lastIndex)} cy={y(v)} r={4} fill={s.color} stroke="var(--color-surface)" strokeWidth={2} />
                {endLabels && lastIndex === n - 1 ? (
                  <text x={x(lastIndex) + 9} y={y(v)} dy="0.32em" className="fill-ink text-[12px] font-medium tabular-nums">
                    {fmt(v)}
                  </text>
                ) : null}
              </g>
            );
          })}

          {/* Crosshair */}
          {active !== null ? (
            <g>
              <line x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + plotH} stroke="var(--color-ink)" strokeOpacity={0.22} shapeRendering="crispEdges" />
              {series.map((s) =>
                s.values[active] === null ? null : (
                  <circle
                    key={s.id}
                    className="chart-mark"
                    cx={x(active)}
                    cy={y(s.values[active] as number)}
                    r={4.5}
                    fill={s.color}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                ),
              )}
            </g>
          ) : null}

          {/* Generous hit area */}
          <rect x={M.left - 12} y={0} width={plotW + 24} height={height} fill="transparent" />
        </svg>
      ) : null}

      {active !== null && width > 0 ? (
        <ChartTooltip x={x(active)} y={M.top + 4} bounds={width} title={pointLabel(points[active], granularity, true)}>
          {series.map((s) => (
            <TooltipRow
              key={s.id}
              color={s.color}
              value={s.values[active] === null ? "—" : fmt(s.values[active] as number)}
              label={s.label}
            />
          ))}
        </ChartTooltip>
      ) : null}
    </div>
  );
}
