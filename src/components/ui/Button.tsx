import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse" | "inverseOutline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-paper hover:bg-forest-deep",
  secondary: "border border-ink/15 text-ink hover:border-ink/35 hover:bg-surface",
  inverse: "bg-paper text-forest-deep hover:bg-white",
  inverseOutline: "border border-paper/25 text-paper hover:border-paper/50 hover:bg-paper/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-[15.5px]",
};

type StyleProps = { variant?: Variant; size?: Size; className?: string };

function buttonClassName({ variant = "primary", size = "md", className }: StyleProps) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-[-0.005em] transition-colors duration-200",
    variants[variant],
    sizes[size],
    className,
  );
}

/** Inline text link used inside forms and supporting copy. */
export const textLinkClassName =
  "rounded-sm font-medium text-forest underline decoration-forest/35 underline-offset-4 transition-colors hover:decoration-forest";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  StyleProps & {
    href: string;
    children: ReactNode;
  };

/**
 * A link styled as a button. Internal routes use client-side navigation;
 * in-page anchors and external URLs render a plain anchor.
 */
export function ButtonLink({ href, variant, size, className, children, ...rest }: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, className });
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  StyleProps & {
    /** Shows a spinner and blocks repeat activation while work is in progress. */
    loading?: boolean;
    /** Label shown while loading, for example "Signing in…". */
    loadingText?: string;
  };

/**
 * A button that stays focusable while busy. It uses aria-disabled rather than
 * the disabled attribute so keyboard and screen reader users keep their place,
 * and it swallows activation (including implicit form submission) while busy.
 */
export function Button({
  variant,
  size,
  className,
  loading = false,
  loadingText,
  disabled,
  type = "button",
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const inactive = loading || disabled;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (inactive) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      aria-disabled={inactive || undefined}
      onClick={handleClick}
      className={buttonClassName({
        variant,
        size,
        className: cn(inactive && "cursor-not-allowed opacity-75", className),
      })}
      {...rest}
    >
      {loading ? <Spinner /> : null}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
