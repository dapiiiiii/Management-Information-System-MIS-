"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds, for elements revealed together. */
  delay?: number;
  id?: string;
};

/**
 * Fades content in once as it scrolls into view.
 *
 * Content is always rendered visible. After hydration, only elements that are
 * still below the fold are hidden, then revealed as they enter the viewport.
 * If JavaScript never runs, nothing is hidden. Reduced-motion visitors get no
 * effect at all. Styling lives in globals.css ([data-reveal]).
 */
export function Reveal({ children, className, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
