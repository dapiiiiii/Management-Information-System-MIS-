"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { DEFAULT_FILTERS, GENDER_OPTIONS, PERIOD_OPTIONS } from "../../hooks/useDashboardFilters";
import { formatMonthRange } from "../../lib/format";
import type { DashboardFilters } from "../../services/dashboard.types";

type FilterBarProps = {
  filters: DashboardFilters;
  onChange: (patch: Partial<DashboardFilters>) => void;
  onReset: () => void;
  range: { from: string; to: string } | null;
  updating: boolean;
};

/**
 * One row of filters above everything they scope. Period first, as the
 * filter people reach for; native radios and select keep keyboard and screen
 * reader behaviour standard.
 */
export function FilterBar({ filters, onChange, onReset, range, updating }: FilterBarProps) {
  const genderId = useId();
  const changed = filters.period !== DEFAULT_FILTERS.period || filters.gender !== DEFAULT_FILTERS.gender;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <fieldset className="min-w-0">
        <legend className="sr-only">Period</legend>
        <div className="inline-flex rounded-lg border border-line bg-surface p-1">
          {PERIOD_OPTIONS.map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="overview-period"
                value={option.value}
                checked={filters.period === option.value}
                onChange={() => onChange({ period: option.value })}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "flex h-8 cursor-pointer items-center whitespace-nowrap rounded-md px-3 text-[13.5px] transition-colors",
                  "text-muted hover:text-ink peer-checked:bg-forest peer-checked:font-medium peer-checked:text-paper",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sun-strong",
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="relative">
        <label htmlFor={genderId} className="sr-only">
          Participants
        </label>
        <select
          id={genderId}
          value={filters.gender}
          onChange={(event) => onChange({ gender: event.target.value as DashboardFilters["gender"] })}
          className="h-10 cursor-pointer appearance-none rounded-lg border border-line bg-surface pl-3 pr-9 text-[13.5px] text-ink transition-colors hover:border-ink/25"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>

      {changed ? (
        <button
          type="button"
          onClick={onReset}
          className="h-10 rounded-md px-2 text-[13.5px] font-medium text-forest underline decoration-forest/35 underline-offset-4 hover:decoration-forest"
        >
          Reset filters
        </button>
      ) : null}

      <p className="flex items-center gap-2 text-[13px] text-muted sm:ml-auto" aria-live="polite">
        {updating ? (
          <>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-spin text-forest" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Updating figures…
          </>
        ) : range ? (
          <>
            <Icon name="calendar" className="h-4 w-4" />
            <span>
              <span className="sr-only">Showing </span>
              {formatMonthRange(range.from, range.to)}
            </span>
          </>
        ) : null}
      </p>
    </div>
  );
}
