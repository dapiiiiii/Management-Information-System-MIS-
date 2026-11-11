import type { ReactNode } from "react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
