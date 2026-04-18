import { z } from "zod";

export const productTableFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["all", "draft", "active", "inactive", "archived"]).optional(),
  categoryId: z.string().optional(),
  featured: z.enum(["all", "featured", "standard"]).optional(),
  image: z.enum(["all", "with-image", "without-image"]).optional(),
  stock: z.enum(["all", "in-stock", "out-of-stock"]).optional(),
  variant: z.enum(["all", "single", "multiple"]).optional(),
  sort: z
    .enum(["updated-desc", "updated-asc", "created-desc", "created-asc", "name-asc", "name-desc"])
    .optional(),
});

export type ProductTableFiltersSchema = z.infer<typeof productTableFiltersSchema>;
