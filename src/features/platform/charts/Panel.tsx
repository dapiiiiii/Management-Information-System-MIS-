"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { DataTable, type TableSpec } from "./DataTable";

type PanelProps = {
  title: string;
  description?: ReactNode;
  /** Controls in the header's top-right corner. */
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Remove body padding, for edge-to-edge tables and lists. */
  flush?: boolean;
};

/** The card every overview widget sits in: one hairline, one surface, one heading. */
export function Panel({ title, description, action, footer, children, className, flush }: PanelProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className={cn("flex min-w-0 flex-col rounded-xl border border-line bg-surface", className)}>
      <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6">
        <div className="min-w-0">
          <h2 id={headingId} className="text-[15.5px] font-medium leading-snug tracking-[-0.006em] text-ink">
            {title}
          </h2>
          {description ? <p className="mt-1 text-[13.5px] leading-snug text-muted">{description}</p> : null}
        </div>
        {action ? <div className="-mr-1 -mt-1 shrink-0">{action}</div> : null}
      </header>
      <div className={cn("flex-1", flush ? "pt-3" : "px-5 pb-5 pt-4 sm:px-6 sm:pb-6")}>{children}</div>
      {footer ? (
        <footer className="border-t border-line px-5 py-3 text-[12.5px] leading-snug text-muted sm:px-6">{footer}</footer>
      ) : null}
    </section>
  );
}

type ChartCardProps = Omit<PanelProps, "action" | "flush"> & {
  legend?: ReactNode;
  /** The chart's table twin. Every chart has one. */
  table: TableSpec;
};

/**
 * A panel holding a chart, with a Chart / Table switch. The table carries
 * every value the chart shows, so nothing depends on hover or on colour.
 */
export function ChartCard({ title, description, legend, table, footer, children, className }: ChartCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  return (
    <Panel
      title={title}
      description={description}
      footer={footer}
      className={className}
      action={<ViewToggle title={title} view={view} onChange={setView} />}
    >
      {view === "chart" ? (
        <>
          {legend ? <div className="mb-4">{legend}</div> : null}
          {children}
        </>
      ) : (
        <DataTable {...table} />
      )}
    </Panel>
  );
}

function ViewToggle({
  title,
  view,
  onChange,
}: {
  title: string;
  view: "chart" | "table";
  onChange: (view: "chart" | "table") => void;
}) {
  return (
    <div role="group" aria-label={`${title}: view as`} className="inline-flex rounded-md border border-line bg-paper p-0.5">
      {(["chart", "table"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          onClick={() => onChange(option)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-[5px] transition-colors",
            view === option ? "bg-surface text-ink shadow-[0_1px_2px_rgb(19_38_32/0.1)]" : "text-muted hover:text-ink",
          )}
        >
          <Icon name={option === "chart" ? "chart" : "table"} className="h-4 w-4" strokeWidth={1.75} />
          <span className="sr-only">{option === "chart" ? "Chart" : "Table"}</span>
        </button>
      ))}
    </div>
  );
}
