import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";

export const categoryStatusConfig = {
  active: {
    label: "Active",
    className: "border-surface-border-strong bg-interactive-selected text-foreground",
  },
  draft: {
    label: "Brouillon",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  inactive: {
    label: "Inactive",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  archived: {
    label: "Archivée",
    className:
      "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  },
} satisfies Record<AdminCategoryCardItem["status"], { label: string; className: string }>;
