import type { ValueFormat } from "../services/dashboard.types";

const LOCALE = "en-GB";

const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat(LOCALE, { notation: "compact", maximumFractionDigits: 1 });

/** 1,284 · 12.9K for large counts · 46% · 95.5% */
export function formatValue(value: number, format: ValueFormat, options: { compact?: boolean } = {}): string {
  if (format === "percent") return `${oneDecimal.format(value)}%`;
  if (options.compact && Math.abs(value) >= 10_000) return compact.format(value);
  return integer.format(value);
}

export function formatCount(value: number): string {
  return integer.format(value);
}

/** "+8.1%" or "−3.1 pts", with a true minus sign. */
export function formatDelta(value: number, unit: "percent" | "points"): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const magnitude = oneDecimal.format(Math.abs(value));
  return unit === "percent" ? `${sign}${magnitude}%` : `${sign}${magnitude} pts`;
}

const dateFormats = {
  day: new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short" }),
  dayYear: new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric" }),
  long: new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "long", year: "numeric" }),
  weekday: new Intl.DateTimeFormat(LOCALE, { weekday: "short", day: "numeric", month: "short" }),
  fullDay: new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  month: new Intl.DateTimeFormat(LOCALE, { month: "short" }),
  monthYear: new Intl.DateTimeFormat(LOCALE, { month: "short", year: "numeric" }),
  longMonthYear: new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" }),
  time: new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit", hour12: false }),
};

export type DateStyle = keyof typeof dateFormats;

/**
 * Formats an ISO date or date-time. Date-only strings are read as local
 * calendar dates, so "2026-03-14" never shifts a day with the time zone.
 */
export function formatDate(iso: string, style: DateStyle = "dayYear"): string {
  return dateFormats[style].format(parseDate(iso));
}

export function parseDate(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(iso);
}

/** "May – Oct 2026", or "Sep 2025 – Oct 2026" across years. */
export function formatMonthRange(from: string, to: string): string {
  const start = parseDate(from);
  const end = parseDate(to);
  const sameYear = start.getFullYear() === end.getFullYear();
  return `${sameYear ? dateFormats.month.format(start) : dateFormats.monthYear.format(start)} – ${dateFormats.monthYear.format(end)}`;
}

export function greeting(now = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}
