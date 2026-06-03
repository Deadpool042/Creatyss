"use client";

import { useEffect } from "react";

type UseRevealActiveCategoryRowArgs = {
  activeSlug: string | null;
};

export function useRevealActiveCategoryRow({
  activeSlug,
}: UseRevealActiveCategoryRowArgs): void {
  useEffect(() => {
    if (!activeSlug || typeof document === "undefined") {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[data-category-row="${activeSlug}"]`)
        ?.scrollIntoView({
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
