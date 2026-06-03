export type ProductPublicationStatus = "draft" | "published";

export const PRODUCT_PUBLICATION_STATUS_VALUES = [
  "draft",
  "published",
] as const satisfies readonly ProductPublicationStatus[];
