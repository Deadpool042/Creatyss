export type ProductLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export const PRODUCT_LIFECYCLE_STATUS_VALUES = [
  "draft",
  "active",
  "inactive",
  "archived",
] as const satisfies readonly ProductLifecycleStatus[];
