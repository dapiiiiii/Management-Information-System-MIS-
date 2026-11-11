import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm, ResetPasswordHeader } from "@/features/auth/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Set a new password", referrer: "no-referrer" };

/** The reset token arrives as ?token=…, which is only known in the browser. */
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordHeader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
