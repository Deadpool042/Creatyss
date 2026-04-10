import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminFormMessageTone = "error" | "success" | "info" | "warning";

type AdminFormMessageProps = Readonly<{
  tone?: AdminFormMessageTone;
  message?: ReactNode | null;
  className?: string;
}>;

export function AdminFormMessage({ tone = "info", message, className }: AdminFormMessageProps) {
  if (!message) {
    return null;
  }

  const config: Record<
    AdminFormMessageTone,
    {
      icon: typeof AlertCircle;
      className: string;
      textClassName: string;
      role: "alert" | "status";
    }
  > = {
    error: {
      icon: AlertCircle,
      className: "border-feedback-error-border bg-feedback-error-surface",
      textClassName: "text-feedback-error-foreground",
      role: "alert",
    },
    success: {
      icon: CheckCircle2,
      className: "border-feedback-success-border bg-feedback-success-surface",
      textClassName: "text-feedback-success-foreground",
      role: "status",
    },
    info: {
      icon: Info,
      className: "border-feedback-info-border bg-feedback-info-surface",
      textClassName: "text-feedback-info-foreground",
      role: "status",
    },
    warning: {
      icon: TriangleAlert,
      className: "border-feedback-warning-border bg-feedback-warning-surface",
      textClassName: "text-feedback-warning-foreground",
      role: "alert",
    },
  };

  const Icon = config[tone].icon;

  return (
    <div
      role={config[tone].role}
      aria-live={config[tone].role === "alert" ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3 py-2.5",
        config[tone].className,
        className
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", config[tone].textClassName)} />
      <div className={cn("text-xs leading-5", config[tone].textClassName)}>{message}</div>
    </div>
  );
}
