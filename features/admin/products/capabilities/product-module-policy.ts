import { adminNavigationCapabilities } from "@/features/admin/navigation";

export const adminProductModuleFeatureFlags = {
  media: "catalog.products.media",
  categories: "catalog.products.categories",
  seo: "catalog.products.seo",
  variants: "catalog.products.variants",
  pricing: "catalog.products.pricing",
  availability: "catalog.products.availability",
  inventory: "catalog.products.inventory",
  related: "catalog.products.related",
} as const;

export type AdminProductModuleFeatureKey =
  keyof typeof adminProductModuleFeatureFlags;

export const adminProductModuleCapabilityRequirements = {
  seo: [adminNavigationCapabilities.content.seoRead],
} as const satisfies Partial<
  Record<AdminProductModuleFeatureKey, readonly string[]>
>;

