"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";

type SeoFieldAutoResetProps = {
  onReset: () => void;
  disabled?: boolean;
};

export function SeoFieldAutoReset({
  onReset,
  disabled = false,
}: SeoFieldAutoResetProps): JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="xs"
      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
      onClick={onReset}
      disabled={disabled}
    >
      Rétablir la valeur automatique
    </Button>
  );
}
