"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const THEME_TRANSITION_DURATION_MS = 600;

type WritableRef<T> = {
  current: T;
};

type ModeToggleProps = {
  size?: "default" | "compact";
};

function enableThemeTransition(timeoutRef: WritableRef<number | null>): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

export function ModeToggle({ size = "default" }: ModeToggleProps) {
  const timeoutRef = useRef<number | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("theme-transition");

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  const ariaLabel = !mounted
    ? "Changer le thème"
    : nextTheme === "dark"
      ? "Activer le mode sombre"
      : "Activer le mode clair";
  const buttonSize = size === "compact" ? "icon-xs" : "icon";

  return (
    <Button
      type="button"
      size={buttonSize}
      variant="ghost"
      className="rounded-full"
      aria-label={ariaLabel}
      aria-disabled={!mounted ? "true" : undefined}
      onClick={() => {
        if (!mounted) {
          return;
        }

        enableThemeTransition(timeoutRef);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTheme(nextTheme);
          });
        });
      }}
    >
      {!mounted ? (
        <span aria-hidden="true" className="size-4" />
      ) : currentTheme === "dark" ? (
        <SunIcon aria-hidden="true" className="size-4" />
      ) : (
        <MoonIcon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
