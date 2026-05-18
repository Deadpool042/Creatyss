import { cn } from "@/lib/utils";

type ProductStatusBadgeProps = {
  status: "draft" | "active" | "inactive" | "archived";
  className?: string;
};

function getStatusLabel(status: ProductStatusBadgeProps["status"]): string {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "archived":
      return "Archivé";
  }
}

function getStatusDotClassName(status: ProductStatusBadgeProps["status"]): string {
  switch (status) {
    case "active":
      return "bg-feedback-success";
    case "draft":
      return "bg-muted-foreground/45";
    case "inactive":
      return "bg-feedback-warning";
    case "archived":
      return "bg-muted-foreground/35";
  }
}

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-foreground",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", getStatusDotClassName(status))}
      />
      <span>{getStatusLabel(status)}</span>
    </span>
  );
}
