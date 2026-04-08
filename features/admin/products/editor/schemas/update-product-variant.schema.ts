import { z } from "zod";

export const updateProductVariantSchema = z.object({
  id: z.string().trim().min(1, "Identifiant variante requis."),
  productId: z.string().trim().min(1, "Identifiant produit requis."),
  name: z.string().trim().max(120, "Nom trop long."),
  slug: z.string().trim().max(160, "Slug trop long."),
  sku: z.string().trim().min(1, "Le SKU est obligatoire.").max(120, "SKU trop long."),
  status: z.enum(["draft", "published", "archived"]),
  isDefault: z.enum(["true", "false"]),
  sortOrder: z
    .string()
    .trim()
    .min(1, "Ordre requis.")
    .refine((value) => Number.isInteger(Number(value)), "L’ordre doit être un entier."),
  priceListId: z.string().trim().min(1, "Tarification requise."),
  amount: z.string().trim(),
  compareAtAmount: z.string().trim(),
  primaryImageId: z.string().trim(),
});
