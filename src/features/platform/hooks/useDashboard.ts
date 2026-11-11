"use client";

import { useCallback, useEffect, useState } from "react";
import type { Role } from "@/features/auth/config/roles";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardData, DashboardFilters } from "../services/dashboard.types";

type Result = { key: string; data: DashboardData | null; error: Error | null };

/**
 * Loads a role's overview for the current filters. While a new slice loads,
 * the previous figures stay on screen (the view dims them) instead of being
 * replaced by a skeleton, so the layout never jumps.
 */
export function useDashboard(role: Role, { period, gender }: DashboardFilters) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result>({ key: "", data: null, error: null });
  const key = `${role}|${period}|${gender}|${attempt}`;

  useEffect(() => {
    let current = true;
    const requestKey = `${role}|${period}|${gender}|${attempt}`;
    dashboardService.getOverview(role, { period, gender }).then(
      (data) => {
        if (current) setResult({ key: requestKey, data, error: null });
      },
      (error: unknown) => {
        if (!current) return;
        setResult((prev) => ({
          key: requestKey,
          data: prev.data,
          error: error instanceof Error ? error : new Error("The overview could not be loaded."),
        }));
      },
    );
    return () => {
      current = false;
    };
  }, [role, period, gender, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    data: result.data,
    error: result.key === key ? result.error : null,
    /** True while the figures on screen are not yet for the current filters. */
    loading: result.key !== key,
    retry,
  };
}
