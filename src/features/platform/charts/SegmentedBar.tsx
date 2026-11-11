"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useElementSize } from "../hooks/useElementSize";
import { formatCount } from "../lib/format";
import type { RankedItem } from "../services/dashboard.types";
import { Legend } from "./Legend";
import { ChartTooltip, TooltipRow } from "./Tooltip";

type SegmentedBarProps = {
  parts: RankedItem[];
  color: (id: string) => string;
  ink: (id: string) => "light" | "dark";
  unit: string;
  label: string;
};

const LABEL_MIN_PX = 44;

/**
 * One whole split into a few parts: a single 28px bar, each part its own
 * block with its share printed where it fits, and a legend of names.
 */
export function SegmentedBar({ parts, color, ink, unit, label }: SegmentedBarProps) {
  const [ref, { width }] = useElementSize<HTMLDivElement>();
  const [active, setActive] = useState<string | null>(null);
  const total = parts.reduce((t, p) => t + p.value, 0);
  const visible = parts.filter((p) => p.value > 0);
  const share = (p: RankedItem) => (total ? p.value / total : 0);
  const pctLabel = (p: RankedItem) => `${Math.round(share(p) * 100)}%`;

  const summary = `${label}: ${parts.map((p) => `${p.label} ${formatCount(p.value)} (${pctLabel(p)})`).join(", ")}`;

  // Centre of each block, from the running share of the blocks before it.
  const anchors = visible.reduce<{ start: number; centres: Record<string, number> }>(
    (acc, p) => ({
      start: acc.start + share(p),
      centres: { ...acc.centres, [p.id]: (acc.start + share(p) / 2) * width },
    }),
    { start: 0, centres: {} },
  ).centres;
  const current = visible.find((p) => p.id === active);

  return (
    <div>
      <div ref={ref} className="relative">
        <div role="img" aria-label={summary} className="flex h-7 w-full gap-[2px]" onPointerLeave={() => setActive(null)}>
          {visible.map((p) => (
            <div
              key={p.id}
              onPointerEnter={() => setActive(p.id)}
              className={cn(
                "chart-mark flex min-w-0 items-center rounded-[4px] px-2.5 text-[12.5px] font-medium tabular-nums transition-opacity duration-150",
                ink(p.id) === "light" ? "text-white" : "text-ink",
                active && active !== p.id && "opacity-55",
              )}
              style={{ flexGrow: share(p), flexBasis: 0, backgroundColor: color(p.id) }}
            >
              {share(p) * width >= LABEL_MIN_PX ? pctLabel(p) : null}
            </div>
          ))}
        </div>
        {current && width > 0 ? (
          <ChartTooltip x={anchors[current.id]} y={0} bounds={width} title={current.label}>
            <TooltipRow shape="rect" color={color(current.id)} value={pctLabel(current)} label={`${formatCount(current.value)} ${unit}`} emphasis />
          </ChartTooltip>
        ) : null}
      </div>
      <Legend
        className="mt-4"
        items={parts.map((p) => ({ id: p.id, label: `${p.label} · ${formatCount(p.value)}`, color: color(p.id) }))}
      />
    </div>
  );
}
