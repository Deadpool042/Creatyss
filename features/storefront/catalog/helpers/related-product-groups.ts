export type CatalogRelatedType =
  | "related"
  | "cross_sell"
  | "up_sell"
  | "accessory"
  | "similar";

export const CATALOG_RELATED_TYPE_CONFIG: Record<
  string,
  { type: CatalogRelatedType; label: string }
> = {
  RELATED: { type: "related", label: "À découvrir aussi" },
  CROSS_SELL: { type: "cross_sell", label: "Compléter avec" },
  UP_SELL: { type: "up_sell", label: "Version premium" },
  ACCESSORY: { type: "accessory", label: "Accessoires conseillés" },
  SIMILAR: { type: "similar", label: "Alternative similaire" },
};

export const CATALOG_RELATED_TYPE_ORDER = [
  "RELATED",
  "CROSS_SELL",
  "UP_SELL",
  "ACCESSORY",
  "SIMILAR",
] as const;

export type CatalogRelatedTypeKey = (typeof CATALOG_RELATED_TYPE_ORDER)[number];
