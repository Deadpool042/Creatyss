import { z } from "zod";

export const updateProductCategoriesSchema = z
  .object({
    id: z.string().trim().min(1, "Identifiant produit manquant."),
    categoryIds: z.array(z.string().trim().min(1)).default([]),
    primaryCategoryId: z.string().trim().default(""),
  })
  .superRefine((input, ctx) => {
    if (input.categoryIds.length === 0 && input.primaryCategoryId.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["primaryCategoryId"],
        message: "Aucune catégorie principale ne peut être définie sans catégorie liée.",
      });
    }

    if (
      input.primaryCategoryId.length > 0 &&
      !input.categoryIds.includes(input.primaryCategoryId)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["primaryCategoryId"],
        message: "La catégorie principale doit faire partie des catégories sélectionnées.",
      });
    }
  });

export type UpdateProductCategoriesSchemaInput = z.input<typeof updateProductCategoriesSchema>;
export type UpdateProductCategoriesSchemaValues = z.infer<typeof updateProductCategoriesSchema>;
