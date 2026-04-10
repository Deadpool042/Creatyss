import { z } from "zod";

export const adminCategoryFormSchema = z.object({
  categoryId: z.string().trim().optional().default(""),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  description: z.string().optional().default(""),
  parentId: z.string().optional().default(""),
  primaryImageId: z.string().optional().default(""),
  isFeatured: z.enum(["true", "false"]).default("false"),
  sortOrder: z.string().trim().min(1),
});

export type AdminCategoryFormSchema = z.infer<typeof adminCategoryFormSchema>;
