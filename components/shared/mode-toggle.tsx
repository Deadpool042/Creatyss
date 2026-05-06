"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useRef, type RefObject } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const THEME_TRANSITION_DURATION_MS = 600;

function enableThemeTransition(timeoutRef: RefObject<number | null>): void {
  const root = document.documentElement;

  root.classList.add("theme-transition");

  if (timeoutRef.current !== null) {
    window.clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = window.setTimeout(() => {
    root.classList.remove("theme-transition");
    timeoutRef.current = null;
  }, THEME_TRANSITION_DURATION_MS);
}

export function ModeToggle() {
  const timeoutRef = useRef<number | null>(null);
  const { resolvedTheme, setTheme } = useTheme();

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={nextTheme === "dark" ? "Activer le mode sombre" : "Activer le mode clair"}
      onClick={() => {
        enableThemeTransition(timeoutRef);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTheme(nextTheme);
          });
        });
      }}
    >
      {currentTheme === "dark" ? (
        <SunIcon aria-hidden="true" className="size-4" />
      ) : (
        <MoonIcon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
