import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";

/** Used for the mobile card pill variant only. Desktop uses CategoryStatusBadge. */
export const categoryStatusConfig = {
  active: {
    label: "Active",
    className:
      "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground",
  },
  draft: {
    label: "Brouillon",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  inactive: {
    label: "Inactive",
    className:
      "border-feedback-warning-border bg-feedback-warning-surface text-feedback-warning-foreground",
  },
  archived: {
    label: "Archivée",
    className:
      "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  },
} satisfies Record<AdminCategoryCardItem["status"], { label: string; className: string }>;
