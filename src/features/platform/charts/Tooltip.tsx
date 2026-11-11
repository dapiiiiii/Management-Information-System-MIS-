import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Swatch } from "./Legend";

type ChartTooltipProps = {
  /** Anchor point in pixels, relative to the positioned chart container. */
  x: number;
  y: number;
  /** Width of the chart container, used to keep the tooltip inside it. */
  bounds: number;
  title: string;
  children: ReactNode;
};

const EDGE = 96;

/**
 * Floating readout for hover and keyboard focus. Purely visual: the same
 * values are announced through each chart's live region and table view.
 */
export function ChartTooltip({ x, y, bounds, title, children }: ChartTooltipProps) {
  const align = x < EDGE ? "start" : x > bounds - EDGE ? "end" : "center";
  const left = align === "start" ? Math.max(0, x - 12) : align === "end" ? Math.min(bounds, x + 12) : x;
  const shift = align === "start" ? "0" : align === "end" ? "-100%" : "-50%";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 min-w-36 rounded-md bg-forest-deep px-3 py-2.5 text-paper shadow-float"
      style={{ left, top: y - 10, translate: `${shift} -100%` }}
    >
      <p className="text-[12px] leading-tight text-paper/65">{title}</p>
      <div className="mt-1.5 space-y-1">{children}</div>
    </div>
  );
}

/** One row of a tooltip: value first and strong, then the series name. */
export function TooltipRow({
  color,
  value,
  label,
  shape = "line",
  emphasis = false,
}: {
  color?: string;
  value: string;
  label: string;
  shape?: "rect" | "line";
  emphasis?: boolean;
}) {
  return (
    <p className={cn("flex items-center gap-2 whitespace-nowrap text-[12.5px] leading-tight", !emphasis && "text-paper/85")}>
      {color ? <Swatch color={color} shape={shape} /> : null}
      <span className="font-semibold tabular-nums text-paper">{value}</span>
      <span className={cn(emphasis ? "text-paper" : "text-paper/70")}>{label}</span>
    </p>
  );
}
