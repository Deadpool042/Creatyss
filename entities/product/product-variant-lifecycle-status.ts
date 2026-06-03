export type ProductVariantLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export const PRODUCT_VARIANT_LIFECYCLE_STATUS_VALUES = [
  "draft",
  "active",
  "inactive",
  "archived",
] as const satisfies readonly ProductVariantLifecycleStatus[];
