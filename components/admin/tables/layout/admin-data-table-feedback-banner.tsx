"use client";

import { cn } from "@/lib/utils";

type AdminDataTableFeedbackBannerProps = {
  message: string | null;
  tone?: "default" | "error";
  className?: string;
};

export function AdminDataTableFeedbackBanner({
  message,
  tone = "default",
  className,
}: AdminDataTableFeedbackBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2 text-sm shadow-card",
        tone === "error"
          ? "border border-destructive/30 bg-destructive/5 text-destructive"
          : "border border-surface-border bg-surface-panel-soft text-foreground",
        className,
      )}
    >
      {message}
    </div>
  );
}
