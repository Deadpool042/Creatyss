"use client";

import { useEffect, useRef, type JSX } from "react";

type AdminFeedSentinelProps = {
  disabled?: boolean;
  onIntersect: () => void | Promise<void>;
  rootMargin?: string;
  /**
   * Sélecteur CSS passé à `element.closest()` pour trouver le conteneur
   * scroll de référence (ex : "[data-scroll-root]"). Si absent, utilise
   * le viewport (`root: null`).
   */
  rootSelector?: string | undefined;
};

export function AdminFeedSentinel({
  disabled = false,
  onIntersect,
  rootMargin = "200px",
  rootSelector,
}: AdminFeedSentinelProps): JSX.Element {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const root = rootSelector
      ? (element.closest<Element>(rootSelector) ?? null)
      : null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        void onIntersect();
      },
      { root, rootMargin, threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled, onIntersect, rootMargin, rootSelector]);

  return <div ref={elementRef} aria-hidden="true" className="h-4 w-full" />;
}
