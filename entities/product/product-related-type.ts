export type ProductRelatedType =
  | "related"
  | "cross_sell"
  | "up_sell"
  | "accessory"
  | "similar";

export const PRODUCT_RELATED_TYPE_VALUES = [
  "related",
  "cross_sell",
  "up_sell",
  "accessory",
  "similar",
] as const satisfies readonly ProductRelatedType[];
