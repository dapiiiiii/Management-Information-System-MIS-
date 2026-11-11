"use client";

import { useCallback, useState } from "react";

/**
 * Measures an element's content box and keeps it current. Returns a callback
 * ref, so it works on elements that mount later (after data arrives).
 */
export function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    if (!node) return;
    const update = () => {
      const { width, height } = node.getBoundingClientRect();
      setSize((prev) =>
        Math.round(prev.width) === Math.round(width) && Math.round(prev.height) === Math.round(height)
          ? prev
          : { width, height },
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
