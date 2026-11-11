import type { Role } from "@/features/auth/config/roles";
import { mockDashboardService } from "./dashboard.mock";
import type { DashboardData, DashboardFilters } from "./dashboard.types";

/**
 * The contract between the overview screens and the platform API.
 * Components depend only on this interface. To connect the real API,
 * implement DashboardService and return it from resolveDashboardService().
 *
 * The role decides which overview is requested; the backend must still
 * scope every figure to what the signed-in account is allowed to see.
 */
export interface DashboardService {
  getOverview(role: Role, filters: DashboardFilters): Promise<DashboardData>;
}

/** True while figures come from the isolated sample service. Drives the "Sample data" notice. */
export const usingSampleData = process.env.NEXT_PUBLIC_PLATFORM_DATA !== "api";

function resolveDashboardService(): DashboardService {
  if (usingSampleData) return mockDashboardService;
  throw new Error(
    "NEXT_PUBLIC_PLATFORM_DATA is 'api' but no API DashboardService is configured. Implement DashboardService against the platform API and return it from resolveDashboardService().",
  );
}

export const dashboardService: DashboardService = resolveDashboardService();

/**
 * Programme overviews support period and gender filters. Personal overviews
 * and the administrator's (current platform state) do not; they show the
 * programme to date.
 */
export function overviewSupportsFilters(role: Role): boolean {
  return !(role === "trainer" || role === "assessor" || role === "trainee" || role === "system_administrator");
}
