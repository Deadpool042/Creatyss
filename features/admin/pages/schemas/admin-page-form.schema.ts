import { z } from "zod";

export const adminPageStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const adminPageFormSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis."),
  slug: z.string().trim().min(1, "Le slug est requis."),
  excerpt: z.string().trim(),
  body: z.string().trim(),
  status: adminPageStatusSchema,
});

export type AdminPageFormSchema = z.infer<typeof adminPageFormSchema>;
