"use client";

import { useEffect, useRef, type JSX } from "react";

type AdminFeedSentinelProps = {
  disabled?: boolean;
  onIntersect: () => void | Promise<void>;
  rootMargin?: string;
  /**
   * Sélecteur CSS passé à `element.closest()` pour trouver le conteneur
   * scroll de référence. Par défaut, on cible le scroll root admin local.
   */
  rootSelector?: string | undefined;
};

export function AdminFeedSentinel({
  disabled = false,
  onIntersect,
  rootMargin = "200px",
  rootSelector = "[data-scroll-root]",
}: AdminFeedSentinelProps): JSX.Element {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;

    const element = elementRef.current;
    if (!element) return;

    const root = element.closest<Element>(rootSelector) ?? null;

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
