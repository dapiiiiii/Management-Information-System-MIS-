import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROLES, roleFromSlug, roleSlug } from "@/features/auth/config/roles";
import { PlatformShell } from "@/features/platform/components/shell/PlatformShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export function generateStaticParams() {
  return ROLES.map((role) => ({ role: roleSlug(role) }));
}

/** Every signed-in page sits in the same frame; the shell guards the session. */
export default async function PlatformLayout({ children, params }: LayoutProps<"/app/[role]">) {
  const role = roleFromSlug((await params).role);
  if (!role) notFound();
  return <PlatformShell role={role}>{children}</PlatformShell>;
}
