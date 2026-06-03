export type CategoryLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export const CATEGORY_LIFECYCLE_STATUS_VALUES = [
  "draft",
  "active",
  "inactive",
  "archived",
] as const satisfies readonly CategoryLifecycleStatus[];

export const CATEGORY_LIFECYCLE_STATUS_LABELS: Record<CategoryLifecycleStatus, string> = {
  draft: "Brouillon",
  active: "Publiée",
  inactive: "Inactive",
  archived: "Archivée",
};

export function isCategoryLifecycleStatus(value: string): value is CategoryLifecycleStatus {
  return CATEGORY_LIFECYCLE_STATUS_VALUES.includes(value as CategoryLifecycleStatus);
}
