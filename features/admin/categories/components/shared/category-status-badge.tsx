import { cn } from "@/lib/utils";

import type { AdminCategoryStatus } from "../../list/types/admin-category-card-item.types";

function getStatusLabel(status: AdminCategoryStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "draft":
      return "Brouillon";
    case "inactive":
      return "Inactive";
    case "archived":
      return "Archivée";
  }
}

function getStatusDotClassName(status: AdminCategoryStatus): string {
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

type CategoryStatusBadgeProps = {
  status: AdminCategoryStatus;
  className?: string;
};

export function CategoryStatusBadge({ status, className }: CategoryStatusBadgeProps) {
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
