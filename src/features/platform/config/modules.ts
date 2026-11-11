import type { IconName } from "@/components/ui/Icon";
import { roleHomeRoute, type Role } from "@/features/auth/config/roles";

/**
 * Platform modules and who sees them. This drives the sidebar, the command
 * menu and the module routes. It presents navigation only: the backend
 * decides what each account may actually read or change.
 */

export type ModuleId =
  | "trainees"
  | "cohorts"
  | "training"
  | "attendance"
  | "assessments"
  | "certificates"
  | "employment"
  | "indicators"
  | "reports"
  | "users"
  | "sync";

export type PlatformModule = {
  id: ModuleId;
  label: string;
  description: string;
  icon: IconName;
};

export const MODULES: Record<ModuleId, PlatformModule> = {
  trainees: {
    id: "trainees",
    label: "Trainees",
    description: "Registration, profiles, enrollment and training progress for every participant.",
    icon: "people",
  },
  cohorts: {
    id: "cohorts",
    label: "Cohorts",
    description: "Cohort composition, schedules and trainer assignment.",
    icon: "enroll",
  },
  training: {
    id: "training",
    label: "Training delivery",
    description: "Curriculum, courses, modules, schedules and practical sessions.",
    icon: "curriculum",
  },
  attendance: {
    id: "attendance",
    label: "Attendance",
    description: "Session attendance, including records captured offline at training sites.",
    icon: "capture",
  },
  assessments: {
    id: "assessments",
    label: "Assessments",
    description: "Theoretical and practical assessment against defined competencies.",
    icon: "assess",
  },
  certificates: {
    id: "certificates",
    label: "Certificates",
    description: "Digital certificates with a unique ID and QR verification.",
    icon: "certificate",
  },
  employment: {
    id: "employment",
    label: "Employment outcomes",
    description: "Post-training follow-up at 3, 6 and 12 months: employment, self-employment and enterprise.",
    icon: "briefcase",
  },
  indicators: {
    id: "indicators",
    label: "Indicators",
    description: "MEL indicators and KPIs, from baseline through midline to endline.",
    icon: "target",
  },
  reports: {
    id: "reports",
    label: "Reports",
    description: "Programme reporting, performance analysis and decision support.",
    icon: "report",
  },
  users: {
    id: "users",
    label: "Users & access",
    description: "Accounts, activation and role assignment under controlled administration.",
    icon: "shieldCheck",
  },
  sync: {
    id: "sync",
    label: "Data sync",
    description: "Device synchronization status and conflicts awaiting review.",
    icon: "sync",
  },
};

export type NavSection = { label: string; modules: readonly ModuleId[] };

/** Module groups shown to each role, in sidebar order. */
export const roleNavigation: Record<Role, readonly NavSection[]> = {
  system_administrator: [
    { label: "Administration", modules: ["users", "sync"] },
    {
      label: "Programme",
      modules: ["trainees", "cohorts", "training", "assessments", "certificates", "employment", "indicators", "reports"],
    },
  ],
  project_manager: [
    { label: "Programme", modules: ["trainees", "cohorts", "training", "assessments", "certificates"] },
    { label: "Results", modules: ["employment", "indicators", "reports"] },
  ],
  training_coordinator: [
    { label: "Delivery", modules: ["trainees", "cohorts", "training", "attendance"] },
    { label: "Results", modules: ["assessments", "certificates"] },
  ],
  trainer: [{ label: "Teaching", modules: ["cohorts", "training", "attendance", "assessments"] }],
  assessor: [{ label: "Assessment", modules: ["assessments", "certificates", "cohorts"] }],
  trainee: [{ label: "My programme", modules: ["training", "certificates", "employment"] }],
  me_officer: [{ label: "Monitoring", modules: ["indicators", "employment", "trainees", "reports"] }],
  funder_partner: [{ label: "Results", modules: ["indicators", "employment", "reports"] }],
};

export function modulesFor(role: Role): ModuleId[] {
  return roleNavigation[role].flatMap((section) => section.modules);
}

export function isModuleId(value: string): value is ModuleId {
  return value in MODULES;
}

export const platformRoutes = {
  overview: (role: Role) => roleHomeRoute[role],
  module: (role: Role, id: ModuleId) => `${roleHomeRoute[role]}/${id}`,
  account: (role: Role) => `${roleHomeRoute[role]}/account`,
};
