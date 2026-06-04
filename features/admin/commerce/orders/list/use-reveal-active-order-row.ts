"use client";

import { useEffect } from "react";

type UseRevealActiveOrderRowArgs = {
  activeSlug: string | null;
};

export function useRevealActiveOrderRow({ activeSlug }: UseRevealActiveOrderRowArgs): void {
  useEffect(() => {
    if (!activeSlug || typeof document === "undefined") {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-order-row="${activeSlug}"]`)?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeSlug]);
}
