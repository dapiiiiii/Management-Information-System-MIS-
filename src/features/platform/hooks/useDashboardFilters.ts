"use client";

import { useCallback, useEffect, useState } from "react";
import { authConfig } from "@/features/auth/config/auth.config";
import { readStoredJSON, writeStoredJSON } from "@/features/auth/lib/storage";
import type { DashboardFilters, GenderFilter, Period } from "../services/dashboard.types";

/** Session-scoped (and cleared on sign-out with every other "tce:" key). */
const STORAGE_KEY = `${authConfig.storagePrefix}overview-filters`;

export const DEFAULT_FILTERS: DashboardFilters = { period: "6m", gender: "all" };

export const PERIOD_OPTIONS: ReadonlyArray<{ value: Period; label: string }> = [
  { value: "6m", label: "6 months" },
  { value: "12m", label: "12 months" },
  { value: "all", label: "Programme to date" },
];

export const GENDER_OPTIONS: ReadonlyArray<{ value: GenderFilter; label: string }> = [
  { value: "all", label: "All participants" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

function readFilters(): DashboardFilters {
  const stored = readStoredJSON("session", STORAGE_KEY) as Partial<DashboardFilters> | null;
  return {
    period: PERIOD_OPTIONS.some((o) => o.value === stored?.period) ? (stored?.period as Period) : DEFAULT_FILTERS.period,
    gender: GENDER_OPTIONS.some((o) => o.value === stored?.gender) ? (stored?.gender as GenderFilter) : DEFAULT_FILTERS.gender,
  };
}

/**
 * Overview filters, remembered for the browser session. Only mounted after
 * the session is known (client-side), so reading storage on first render is safe.
 */
export function useDashboardFilters() {
  const [filters, setFilters] = useState<DashboardFilters>(readFilters);

  useEffect(() => {
    writeStoredJSON("session", STORAGE_KEY, filters);
  }, [filters]);

  const update = useCallback((patch: Partial<DashboardFilters>) => setFilters((prev) => ({ ...prev, ...patch })), []);
  const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, update, reset };
}
