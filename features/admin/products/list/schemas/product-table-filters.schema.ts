import { z } from "zod";

export const productTableStatusFilterSchema = z.enum(["all", "published", "draft", "archived"]);

export const productTableFeaturedFilterSchema = z.enum(["all", "featured", "standard"]);

export const productTableImageFilterSchema = z.enum(["all", "with-image", "without-image"]);

export const productTableVariantFilterSchema = z.enum([
  "all",
  "with-variants",
  "without-variants",
  "single-variant",
  "multi-variant",
]);

export const productTableStockFilterSchema = z.enum([
  "all",
  "in-stock",
  "low-stock",
  "out-of-stock",
]);

export const productTableSortOptionSchema = z.enum([
  "updated-desc",
  "name-asc",
  "name-desc",
  "price-asc",
  "price-desc",
]);

export const productTableFiltersSchema = z.object({
  search: z.string().trim().default(""),
  status: productTableStatusFilterSchema.default("all"),
  parentCategory: z.string().trim().min(1).default("all"),
  category: z.string().trim().min(1).default("all"),
  featured: productTableFeaturedFilterSchema.default("all"),
  image: productTableImageFilterSchema.default("all"),
  variant: productTableVariantFilterSchema.default("all"),
  stock: productTableStockFilterSchema.default("all"),
  sort: productTableSortOptionSchema.default("updated-desc"),
  page: z.coerce.number().int().min(1).default(1),
});

export type ProductTableFiltersInput = z.input<typeof productTableFiltersSchema>;
export type ProductTableFiltersValues = z.infer<typeof productTableFiltersSchema>;
export type ProductTableStatusFilter = z.infer<typeof productTableStatusFilterSchema>;
export type ProductTableFeaturedFilter = z.infer<typeof productTableFeaturedFilterSchema>;
export type ProductTableImageFilter = z.infer<typeof productTableImageFilterSchema>;
export type ProductTableVariantFilter = z.infer<typeof productTableVariantFilterSchema>;
export type ProductTableStockFilter = z.infer<typeof productTableStockFilterSchema>;
export type ProductTableSortOption = z.infer<typeof productTableSortOptionSchema>;
