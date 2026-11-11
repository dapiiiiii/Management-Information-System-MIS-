import type { ReactNode } from "react";

/**
 * Templates remount on every navigation, so each auth route fades in with an
 * 8px rise (220ms, ease-out). Reduced motion removes the movement.
 */
export default function AuthTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-auth-enter">{children}</div>;
}
