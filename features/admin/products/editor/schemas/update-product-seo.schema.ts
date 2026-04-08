import { z } from "zod";

export const updateProductSeoSchema = z.object({
  id: z.string().trim().min(1, "Identifiant produit manquant."),
  seoTitle: z.string().trim(),
  seoDescription: z.string().trim(),
});
