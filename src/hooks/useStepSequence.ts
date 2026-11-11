"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** Number of steps in the sequence. */
  length: number;
  /** Time each step is shown while playing, in milliseconds. */
  interval: number;
  /** Portion of the element that must be visible before it plays. */
  threshold?: number;
};

/**
 * Drives a step-by-step illustration. When the element first scrolls into
 * view the sequence plays through once and stops on the last step. Any
 * interaction hands control to the visitor and stops playback for good.
 * With reduced motion, it jumps straight to the completed state.
 */
export function useStepSequence<T extends HTMLElement>({ length, interval, threshold = 0.35 }: Options) {
  const ref = useRef<T>(null);
  const [index, setIndex] = useState(0);
  const current = useRef(0);
  const interacted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: number | undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (interacted.current) return;

        if (reduceMotion) {
          current.current = length - 1;
          setIndex(length - 1);
          return;
        }

        timer = window.setInterval(() => {
          if (interacted.current || current.current >= length - 1) {
            window.clearInterval(timer);
            return;
          }
          current.current += 1;
          setIndex(current.current);
        }, interval);
      },
      { threshold },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) window.clearInterval(timer);
    };
  }, [length, interval, threshold]);

  const select = useCallback((next: number) => {
    interacted.current = true;
    current.current = next;
    setIndex(next);
  }, []);

  return { ref, index, select };
}
