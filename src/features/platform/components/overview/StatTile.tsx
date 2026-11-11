import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Sparkline } from "../../charts/Sparkline";
import { formatDelta, formatValue } from "../../lib/format";
import type { Delta, Kpi } from "../../services/dashboard.types";

/**
 * A headline figure: label, value, then either the change against a named
 * period or one line of context. Direction is shown by icon and words, not
 * colour alone.
 */
export function StatTile({ kpi }: { kpi: Kpi }) {
  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-line bg-surface px-5 py-5">
      <p className="text-[13.5px] leading-snug text-muted">{kpi.label}</p>
      {/* The value row takes the free space, so values line up across a row of tiles. */}
      <div className="mt-3 flex flex-1 items-end justify-between gap-3">
        <p className="text-[clamp(1.875rem,1.6rem+0.8vw,2.25rem)] font-medium leading-none tracking-[-0.025em] font-stretch-semi-condensed text-ink">
          {formatValue(kpi.value, kpi.format)}
          {kpi.suffix ? <span className="ml-1.5 text-[15px] font-normal tracking-normal text-muted">{kpi.suffix}</span> : null}
        </p>
        {kpi.trend ? <Sparkline values={kpi.trend} /> : null}
      </div>
      <div className="pt-3.5">
        {kpi.delta ? <DeltaLine delta={kpi.delta} /> : kpi.note ? <p className="text-[13px] leading-snug text-muted">{kpi.note}</p> : null}
      </div>
    </div>
  );
}

function DeltaLine({ delta }: { delta: Delta }) {
  const direction = delta.value > 0 ? "up" : delta.value < 0 ? "down" : "flat";
  const good = direction === "flat" ? null : (direction === "up") === delta.upIsGood;
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-[13px] leading-snug">
      <span
        className={cn(
          "inline-flex items-center gap-1 font-medium tabular-nums",
          good === null ? "text-muted" : good ? "text-leaf" : "text-error",
        )}
      >
        <Icon name={direction === "up" ? "trendUp" : direction === "down" ? "trendDown" : "minus"} className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="sr-only">{direction === "up" ? "Up" : direction === "down" ? "Down" : "No change"}</span>
        {formatDelta(delta.value, delta.unit)}
      </span>
      <span className="text-muted">vs {delta.comparison}</span>
    </p>
  );
}

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <section aria-label="Headline figures" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <StatTile key={kpi.id} kpi={kpi} />
      ))}
    </section>
  );
}
