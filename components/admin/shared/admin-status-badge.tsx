import { cn } from "@/lib/utils";

export type AdminStatusVariant = "active" | "draft" | "inactive" | "archived";

const DEFAULT_LABELS: Record<AdminStatusVariant, string> = {
  active: "Actif",
  draft: "Brouillon",
  inactive: "Inactif",
  archived: "Archivé",
};

const DOT_CLASSNAMES: Record<AdminStatusVariant, string> = {
  active: "bg-feedback-success",
  draft: "bg-muted-foreground/45",
  inactive: "bg-feedback-warning",
  archived: "bg-muted-foreground/35",
};

type AdminStatusBadgeProps = {
  status: AdminStatusVariant;
  label?: string;
  className?: string;
};

export function AdminStatusBadge({ status, label, className }: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-foreground",
        className
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", DOT_CLASSNAMES[status])} />
      <span>{label ?? DEFAULT_LABELS[status]}</span>
    </span>
  );
}
