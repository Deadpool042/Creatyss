import { z } from "zod";

export const productTableFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum(["draft", "active", "inactive", "archived"])).optional(),
  categories: z.array(z.string()).optional(),
  featured: z.array(z.enum(["featured", "standard"])).optional(),
  image: z.enum(["all", "with-image", "without-image"]).optional(),
  stock: z.enum(["all", "in-stock", "out-of-stock"]).optional(),
  variant: z.enum(["all", "single", "multiple"]).optional(),
  sort: z
    .enum(["updated-desc", "updated-asc", "name-asc", "name-desc"])
    .optional(),
});

export type ProductTableFiltersSchema = z.infer<typeof productTableFiltersSchema>;
