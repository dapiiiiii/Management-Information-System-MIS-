import type { IconName } from "@/components/ui/Icon";

/**
 * Central content and configuration for the public homepage.
 * Programme teams can edit wording here without touching components.
 */

export const site = {
  name: "Training, Certification & Employment Management Information System",
  shortName: "TCE MIS",
  tagline: "Training • Certification • Employment",
  description:
    "A unified digital platform for managing solar PV training, certification, employment outcomes and programme impact.",
  /**
   * Where the homepage's "Access Platform" calls to action point. Signed-in
   * visitors arriving at /login are offered their platform directly.
   */
  platformUrl: process.env.NEXT_PUBLIC_PLATFORM_URL ?? "/login",
  copyrightYear: 2026,
} as const;

export type NavItem = { label: string; href: string; id: string };

export const navItems: NavItem[] = [
  { label: "Overview", href: "#overview", id: "overview" },
  { label: "Programme", href: "#programme", id: "programme" },
  { label: "Training", href: "#training", id: "training" },
  { label: "Certification", href: "#certification", id: "certification" },
  { label: "Employment", href: "#employment", id: "employment" },
  { label: "Impact", href: "#impact", id: "impact" },
];

export const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Platform Access", href: site.platformUrl },
];

export const capabilityStrip = [
  { word: "TRAIN", text: "Structured solar PV learning pathways" },
  { word: "CERTIFY", text: "Verified assessment and certification" },
  { word: "CONNECT", text: "Employment and entrepreneurship tracking" },
  { word: "MEASURE", text: "Monitoring, evaluation and impact reporting" },
];

export type LifecycleStage = {
  label: string;
  sentence: string;
  icon: IconName;
};

export const lifecycleStages: LifecycleStage[] = [
  {
    label: "Enroll",
    sentence: "Register applicants, confirm eligibility and assign each trainee to a cohort.",
    icon: "enroll",
  },
  {
    label: "Train",
    sentence: "Deliver courses, modules and practical sessions, with attendance taken at every session.",
    icon: "panel",
  },
  {
    label: "Assess",
    sentence: "Record theoretical and practical assessments against defined competencies.",
    icon: "assess",
  },
  {
    label: "Certify",
    sentence: "Issue digital certificates with a unique ID and QR verification.",
    icon: "seal",
  },
  {
    label: "Employ",
    sentence: "Follow graduates into jobs and enterprise at 3, 6 and 12 months.",
    icon: "briefcase",
  },
  {
    label: "Measure",
    sentence: "Track indicators from baseline to endline and report programme results.",
    icon: "measure",
  },
];

export type Capability = { title: string; body: string; icon: IconName };

export const capabilities: Capability[] = [
  {
    title: "Trainee Management",
    body: "Registration, profiles, enrollment, cohorts and training progress.",
    icon: "people",
  },
  {
    title: "Training Management",
    body: "Curriculum, courses, modules, schedules, trainers and practical sessions.",
    icon: "curriculum",
  },
  {
    title: "Assessment & Certification",
    body: "Theoretical and practical assessment, grading and digital certificates.",
    icon: "certificate",
  },
  {
    title: "Employment Outcomes",
    body: "Employment, entrepreneurship and post-training follow-up.",
    icon: "pathway",
  },
  {
    title: "Monitoring & Impact",
    body: "MEL indicators, KPIs, baseline, midline and endline measurement.",
    icon: "target",
  },
  {
    title: "Intelligence & Reporting",
    body: "Dashboards, reporting, performance analysis and decision support.",
    icon: "report",
  },
];

export type RecordStage = {
  label: string;
  summary: string;
  fields: string[];
  doneLabel: string;
};

/** One participant's record, as it accumulates through the programme. */
export const recordStages: RecordStage[] = [
  {
    label: "Participant data",
    summary: "Registration, eligibility and baseline",
    fields: ["Profile", "Eligibility", "Baseline survey", "Consent"],
    doneLabel: "Captured",
  },
  {
    label: "Training progress",
    summary: "Modules, attendance and practical work",
    fields: ["Cohort", "Module progress", "Attendance", "Practical sessions"],
    doneLabel: "Recorded",
  },
  {
    label: "Assessment results",
    summary: "Theoretical and practical results",
    fields: ["Theory assessment", "Practical assessment", "Competency result"],
    doneLabel: "Assessed",
  },
  {
    label: "Certification",
    summary: "A unique, verifiable credential",
    fields: ["Certificate ID", "QR verification", "Date of issue"],
    doneLabel: "Issued",
  },
  {
    label: "Employment outcomes",
    summary: "Follow-up at 3, 6 and 12 months",
    fields: ["3-month follow-up", "6-month follow-up", "12-month follow-up", "Enterprise status"],
    doneLabel: "Tracked",
  },
  {
    label: "Programme impact",
    summary: "Indicators, analysis and reporting",
    fields: ["KPI contribution", "Disaggregated results", "Baseline to endline", "Partner reporting"],
    doneLabel: "Reported",
  },
];

export type OfflineStep = { label: string; detail: string; icon: IconName };

export const offlineSteps: OfflineStep[] = [
  {
    label: "Offline",
    detail: "The connection drops at the training site. The app keeps working.",
    icon: "wifiOff",
  },
  {
    label: "Capture",
    detail: "Trainers carry on taking attendance and recording results.",
    icon: "capture",
  },
  {
    label: "Store",
    detail: "Records are held securely on the device until they can be sent.",
    icon: "store",
  },
  {
    label: "Reconnect",
    detail: "When a connection returns, the app detects it automatically.",
    icon: "wifi",
  },
  {
    label: "Synchronize",
    detail: "Records upload on their own. Anything that conflicts is flagged for review.",
    icon: "sync",
  },
];

export const followUps = [
  {
    month: 3,
    title: "Early transition",
    body: "First job, apprenticeship or business start-up recorded.",
  },
  {
    month: 6,
    title: "Stability",
    body: "Job retention, source of income and enterprise activity.",
  },
  {
    month: 12,
    title: "Sustained outcome",
    body: "Long-term employment and enterprise status, feeding endline indicators.",
  },
];

/** Specimen data shown in illustrations. Clearly labelled as a sample. */
export const specimen = {
  trainee: "Amina Hassan",
  initials: "AH",
  cohort: "Cohort B",
  qualification: "Solar PV Installation and Maintenance",
  certificateId: "TCE-PV-2026-00418",
  issued: "14 March 2026",
};

/**
 * Photography credits. Both images are placeholders until the programme's
 * own documentary photography is available.
 */
export const photoCredits = [
  {
    text: "Solar training lab: USAID in Africa, public domain",
    href: "https://commons.wikimedia.org/wiki/File:Solar_Training_in_Nairobi_(18770277590).jpg",
  },
  {
    text: "Field workshop: UN Women/Laura Cleary, CC BY-SA 2.0, cropped and toned",
    href: "https://commons.wikimedia.org/wiki/File:2013-_Kadavu_Visit_(14216527355).jpg",
  },
];
