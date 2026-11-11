import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROLES, roleFromSlug, roleSlug } from "@/features/auth/config/roles";
import { AccountView } from "@/features/platform/components/AccountView";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return ROLES.map((role) => ({ role: roleSlug(role) }));
}

export default async function AccountPage({ params }: PageProps<"/app/[role]/account">) {
  const role = roleFromSlug((await params).role);
  if (!role) notFound();
  return <AccountView />;
}
