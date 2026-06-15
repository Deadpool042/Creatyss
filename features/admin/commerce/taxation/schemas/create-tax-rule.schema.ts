import { z } from "zod";

/** Création d'une règle de TVA (scope STORE, countryCode FR, prix TTC). */
export const createTaxRuleSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Le code doit contenir au moins 2 caractères.")
    .max(40, "Le code est trop long (40 caractères maximum).")
    .regex(/^[A-Z0-9_-]+$/i, "Lettres, chiffres, tirets et underscores uniquement."),
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(120, "Le nom est trop long (120 caractères maximum)."),
  regionCode: z.union([z.literal("971"), z.literal("972"), z.literal("973"), z.literal("974"), z.literal("976")]).nullable(),
  ratePercent: z
    .number()
    .min(0, "Le taux doit être positif ou nul.")
    .max(100, "Le taux ne peut pas dépasser 100."),
});

export type CreateTaxRuleInput = z.infer<typeof createTaxRuleSchema>;
