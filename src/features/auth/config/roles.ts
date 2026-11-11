/**
 * Platform roles. Public registration only ever creates `trainee` accounts;
 * every other role is assigned by an administrator. The frontend uses roles
 * to present UI only: authorization is enforced by the backend.
 */
export const ROLES = [
  "system_administrator",
  "project_manager",
  "training_coordinator",
  "trainer",
  "assessor",
  "trainee",
  "me_officer",
  "funder_partner",
] as const;

export type Role = (typeof ROLES)[number];

export const roleLabels: Record<Role, string> = {
  system_administrator: "System Administrator",
  project_manager: "Project Manager",
  training_coordinator: "Training Coordinator",
  trainer: "Trainer / Instructor",
  assessor: "Assessor / Examiner",
  trainee: "Trainee",
  me_officer: "Monitoring & Evaluation Officer",
  funder_partner: "Funder / Partner",
};

/** Where each role lands after signing in. The single source for post-login routing. */
export const roleHomeRoute = {
  system_administrator: "/app/administrator",
  project_manager: "/app/project-manager",
  training_coordinator: "/app/training-coordinator",
  trainer: "/app/trainer",
  assessor: "/app/assessor",
  trainee: "/app/trainee",
  me_officer: "/app/monitoring-evaluation",
  funder_partner: "/app/partner",
} as const satisfies Record<Role, `/app/${string}`>;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** The URL segment for a role's area, for example "trainee". */
export function roleSlug(role: Role): string {
  return roleHomeRoute[role].slice("/app/".length);
}

export function roleFromSlug(slug: string): Role | null {
  return ROLES.find((role) => roleSlug(role) === slug) ?? null;
}
