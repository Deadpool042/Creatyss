"use client";

import { useEffect, useRef, type JSX } from "react";

type ProductFeedSentinelProps = {
  disabled?: boolean;
  onIntersect: () => void | Promise<void>;
  rootMargin?: string;
};

export function ProductFeedSentinel({
  disabled = false,
  onIntersect,
  rootMargin = "200px",
}: ProductFeedSentinelProps): JSX.Element {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        void onIntersect();
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [disabled, onIntersect, rootMargin]);

  return <div ref={elementRef} aria-hidden="true" className="h-4 w-full" />;
}
