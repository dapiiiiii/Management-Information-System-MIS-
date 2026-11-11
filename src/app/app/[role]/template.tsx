import type { ReactNode } from "react";

/**
 * Templates remount on every navigation, so each platform view fades in with
 * the same quiet 8px rise as the authentication pages. The shell stays put.
 */
export default function PlatformTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-view-enter">{children}</div>;
}
