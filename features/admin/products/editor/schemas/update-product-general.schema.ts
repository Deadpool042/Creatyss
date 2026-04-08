import { z } from "zod";

export const updateProductGeneralSchema = z.object({
  id: z.string().trim().min(1, "Identifiant produit manquant."),
  name: z.string().trim().min(1, "Le nom du produit est obligatoire."),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est obligatoire.")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."
    ),
  shortDescription: z.string().trim(),
  description: z.string().trim(),
  status: z.enum(["draft", "published", "archived"], {
    error: "Le statut est invalide.",
  }),
  isFeatured: z.enum(["true", "false"]).transform((value) => value === "true"),
});
