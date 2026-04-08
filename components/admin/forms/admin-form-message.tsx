import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminFormMessageTone = "error" | "success" | "info";

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
    }
  > = {
    error: {
      icon: AlertCircle,
      className: "border-destructive/30 bg-destructive/5",
      textClassName: "text-destructive",
    },
    success: {
      icon: CheckCircle2,
      className: "border-border bg-muted/30",
      textClassName: "text-foreground",
    },
    info: {
      icon: AlertCircle,
      className: "border-border bg-muted/30",
      textClassName: "text-foreground",
    },
  };

  const Icon = config[tone].icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2.5",
        config[tone].className,
        className
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", config[tone].textClassName)} />
      <div className={cn("text-xs", config[tone].textClassName)}>{message}</div>
    </div>
  );
}
