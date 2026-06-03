export type ProductAvailabilityStatus =
  | "available"
  | "unavailable"
  | "preorder"
  | "backorder"
  | "discontinued"
  | "archived";

export const PRODUCT_AVAILABILITY_STATUS_VALUES = [
  "available",
  "unavailable",
  "preorder",
  "backorder",
  "discontinued",
  "archived",
] as const satisfies readonly ProductAvailabilityStatus[];
