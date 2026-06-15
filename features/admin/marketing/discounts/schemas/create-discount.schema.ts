import { z } from "zod";

/**
 * Niveau `simple` (cf. `docs/lots/2026-06-13-commerce-discounts-cadrage.md`,
 * décision B1) : PERCENTAGE ou FIXED_AMOUNT, scope ORDER (valeur par défaut
 * du modèle `Discount`). FREE_SHIPPING et les autres scopes restent pour le
 * niveau `rules`.
 */
export const createDiscountSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Le code doit contenir au moins 2 caractères.")
      .max(40, "Le code est trop long (40 caractères maximum).")
      .regex(
        /^[A-Z0-9_-]+$/i,
        "Le code ne peut contenir que des lettres, chiffres, tirets et underscores."
      ),
    name: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(120, "Le nom est trop long (120 caractères maximum)."),
    description: z
      .string()
      .trim()
      .max(500, "La description est trop longue (500 caractères maximum).")
      .nullable(),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    percentageValue: z.number().min(0, "Le pourcentage doit être positif.").max(100, "Le pourcentage ne peut pas dépasser 100.").nullable(),
    fixedAmountValue: z.number().min(0, "Le montant doit être positif.").nullable(),
  })
  .refine((data) => (data.type === "PERCENTAGE" ? data.percentageValue !== null : true), {
    message: "Indiquez un pourcentage de remise.",
    path: ["percentageValue"],
  })
  .refine((data) => (data.type === "FIXED_AMOUNT" ? data.fixedAmountValue !== null : true), {
    message: "Indiquez un montant de remise.",
    path: ["fixedAmountValue"],
  });

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
