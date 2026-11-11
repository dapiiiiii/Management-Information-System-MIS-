import type { SVGProps } from "react";

/**
 * A small, consistent line-icon set (24px grid, 1.5 stroke) drawn for this
 * platform, so no icon library is needed.
 */
const paths = {
  enroll: (
    <>
      <circle cx="10" cy="8" r="3.25" />
      <path d="M4 19.5c.8-3.2 3.2-5 6-5s5.2 1.8 6 5" />
      <path d="M18.5 7.5v5M16 10h5" />
    </>
  ),
  panel: (
    <>
      <path d="M6 5h13.5l-2 8.5H4z" />
      <path d="M11.2 5l-1.6 8.5M16 5l-1.6 8.5M5 9.25h13.8" />
      <path d="M10.75 13.5v6M7.5 19.5h6.5" />
    </>
  ),
  assess: (
    <>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 4.5V3.25h6V4.5" />
      <path d="M8.75 12.75 11 15l4.5-4.75" />
    </>
  ),
  seal: (
    <>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="m9.25 14.4-1.5 6.35L12 18.6l4.25 2.15-1.5-6.35" />
      <path d="m10 9.6 1.4 1.4 2.6-2.75" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M9 7.5V5.75c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5V7.5" />
      <path d="M3.5 12.5h17M11 12.5v1.5h2v-1.5" />
    </>
  ),
  measure: (
    <>
      <path d="M4 4v16h16" />
      <path d="m7.5 15 3.5-4 3 2.5 5.5-6.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.7-3 2.9-4.75 5.5-4.75S13.8 16 14.5 19" />
      <circle cx="16.75" cy="9.25" r="2.5" />
      <path d="M16 14.35c2.25-.15 4 1.35 4.75 4.15" />
    </>
  ),
  curriculum: (
    <>
      <path d="M3.75 5.75c2.75-.95 5.5-.6 8.25 1 2.75-1.6 5.5-1.95 8.25-1v13c-2.75-.95-5.5-.6-8.25 1-2.75-1.6-5.5-1.95-8.25-1z" />
      <path d="M12 6.75v13" />
    </>
  ),
  certificate: (
    <>
      <path d="M13 17.5H5A1.5 1.5 0 0 1 3.5 16V6.5A1.5 1.5 0 0 1 5 5h14a1.5 1.5 0 0 1 1.5 1.5V11" />
      <path d="M7 9h8M7 12.25h4.5" />
      <circle cx="17.5" cy="14" r="2.5" />
      <path d="m16.25 16.25-.75 4 2-1.1 2 1.1-.75-4" />
    </>
  ),
  pathway: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h5.5a3 3 0 0 0 0-6h-3a3 3 0 0 1 0-6H16" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  report: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M8 16v-4M12 16V8M16 16v-6" />
    </>
  ),
  wifiOff: (
    <>
      <path d="m3.5 3.5 17 17" />
      <path d="M8.75 16.25a4.75 4.75 0 0 1 5.6-.75" />
      <path d="M5.25 12.75a9.75 9.75 0 0 1 3.9-2.35M18.75 12.75a9.7 9.7 0 0 0-2.4-1.75" />
      <path d="M2.25 9.25a14.6 14.6 0 0 1 3.9-2.6M21.75 9.25A14.7 14.7 0 0 0 11 5.6" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  wifi: (
    <>
      <path d="M8.75 16.25a4.75 4.75 0 0 1 6.5 0" />
      <path d="M5.25 12.75a9.75 9.75 0 0 1 13.5 0" />
      <path d="M2.25 9.25a14.75 14.75 0 0 1 19.5 0" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  capture: (
    <>
      <path d="M4 20v-3.5L15.25 5.25a2.12 2.12 0 0 1 3 3L7 19.5z" transform="translate(0 .5)" />
      <path d="m13.5 7.5 3 3" />
    </>
  ),
  store: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  sync: (
    <>
      <path d="M19.5 11A7.75 7.75 0 0 0 5.6 7.4L4.5 8.75" />
      <path d="M4.5 4.75v4h4" />
      <path d="M4.5 13a7.75 7.75 0 0 0 13.9 3.6l1.1-1.35" />
      <path d="M19.5 19.25v-4h-4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  shieldCheck: (
    <>
      <path d="M12 3.5 19 6v5.5c0 4.4-3 7.9-7 9-4-1.1-7-4.6-7-9V6z" />
      <path d="m8.75 12 2.25 2.25 4.25-4.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3.5 3.5 17 17" />
      <path d="M10.6 5.6c.46-.07.92-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 6.9C4 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.55 0 2.95-.4 4.2-1.05" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V13" />
      <circle cx="12" cy="16.25" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.25 12.25 2.5 2.5 5-5.25" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.75" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5v-3a4 4 0 0 1 8 0v3M12 14.5v2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.9-3.6 3.7-5.5 7-5.5s6.1 1.9 7 5.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  logOut: (
    <>
      <path d="M9.5 20.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5h3.5" />
      <path d="M15.5 16.5 20 12l-4.5-4.5M20 12H9.5" />
    </>
  ),
  arrowLeft: <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />,
  arrowRight: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  trendUp: <path d="M7 17 17 7M9 7h8v8" />,
  trendDown: <path d="M7 7l10 10M17 9v8H9" />,
  minus: <path d="M6 12h12" />,
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  table: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19.5h16" />
      <path d="M7 16V11M12 16V6.5M17 16v-7" />
    </>
  ),
  menu: <path d="M4 8.5h16M4 15.5h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  battery: (
    <>
      <rect x="2.5" y="7.5" width="17" height="9" rx="2" />
      <path d="M21.5 10.5v3" />
      <rect x="4.5" y="9.5" width="11" height="5" rx=".75" fill="currentColor" stroke="none" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  /** Provide a label only when the icon carries meaning on its own. */
  title?: string;
};

export function Icon({ name, title, className, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
