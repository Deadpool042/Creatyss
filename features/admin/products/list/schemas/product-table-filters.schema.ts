import { z } from "zod";

export const productTableFiltersSchema = z.object({
  search: z.string().trim().default(""),
  status: z.enum(["all", "draft", "active", "inactive", "archived"]).default("all"),
  categoryId: z.string().trim().default("all"),
  parentCategoryId: z.string().trim().default("all"),
  featured: z.enum(["all", "featured", "standard"]).default("all"),
  image: z.enum(["all", "with-image", "without-image"]).default("all"),
  stock: z.enum(["all", "in-stock", "out-of-stock"]).default("all"),
  variant: z.enum(["all", "single", "multiple"]).default("all"),
  sort: z.enum(["updated-desc", "updated-asc", "name-asc", "name-desc"]).default("updated-desc"),
});

export type ProductTableFiltersSchema = typeof productTableFiltersSchema;
