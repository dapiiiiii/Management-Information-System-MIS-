import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { roleFromSlug } from "@/features/auth/config/roles";
import { ModuleView } from "@/features/platform/components/ModuleView";
import { isModuleId, MODULES, modulesFor } from "@/features/platform/config/modules";

type Params = PageProps<"/app/[role]/[module]">["params"];

/** Resolves the route, or null when the module is not one this role works with. */
async function resolve(params: Params) {
  const { role: slug, module: id } = await params;
  const role = roleFromSlug(slug);
  if (!role || !isModuleId(id) || !modulesFor(role).includes(id)) return null;
  return { role, id };
}

export async function generateStaticParams({ params }: { params: { role: string } }) {
  const role = roleFromSlug(params.role);
  return role ? modulesFor(role).map((id) => ({ module: id })) : [];
}

export async function generateMetadata({ params }: PageProps<"/app/[role]/[module]">): Promise<Metadata> {
  const route = await resolve(params);
  return { title: route ? MODULES[route.id].label : "Platform", robots: { index: false, follow: false } };
}

export default async function ModulePage({ params }: PageProps<"/app/[role]/[module]">) {
  const route = await resolve(params);
  if (!route) notFound();
  return <ModuleView role={route.role} moduleId={route.id} />;
}
