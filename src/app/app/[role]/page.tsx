import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROLES, roleFromSlug, roleSlug } from "@/features/auth/config/roles";
import { OverviewView } from "@/features/platform/components/overview/OverviewView";

export const metadata: Metadata = { title: "Overview", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return ROLES.map((role) => ({ role: roleSlug(role) }));
}

export default async function OverviewPage({ params }: PageProps<"/app/[role]">) {
  const role = roleFromSlug((await params).role);
  if (!role) notFound();
  return <OverviewView role={role} />;
}
