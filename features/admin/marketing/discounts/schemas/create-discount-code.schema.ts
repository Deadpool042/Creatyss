import { z } from "zod";

/**
 * Schéma de création d'un `DiscountCode` secondaire pour un `Discount`
 * existant — niveau `rules` (cf. `docs/lots/2026-06-13-commerce-discounts-cadrage.md`).
 */
export const createDiscountCodeSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Le code doit contenir au moins 3 caractères.")
      .max(40, "Le code est trop long (40 caractères maximum).")
      .regex(
        /^[A-Z0-9_-]+$/i,
        "Le code ne peut contenir que des lettres, chiffres, tirets et underscores."
      ),
    maxRedemptions: z
      .number()
      .int("Le nombre maximum d'utilisations doit être un entier.")
      .positive("Le nombre maximum d'utilisations doit être supérieur à 0.")
      .nullable(),
    startsAt: z.date().nullable(),
    endsAt: z.date().nullable(),
  })
  .refine(
    (data) =>
      data.startsAt === null ||
      data.endsAt === null ||
      data.endsAt.getTime() >= data.startsAt.getTime(),
    {
      message: "La date de fin doit être postérieure à la date de début.",
      path: ["endsAt"],
    }
  );

export type CreateDiscountCodeInput = z.infer<typeof createDiscountCodeSchema>;
