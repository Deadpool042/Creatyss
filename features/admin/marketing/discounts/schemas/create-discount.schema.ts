import { z } from "zod";

const discountCodeSchema = z
  .string()
  .trim()
  .min(2, "Le code doit contenir au moins 2 caractères.")
  .max(40, "Le code est trop long (40 caractères maximum).")
  .regex(
    /^[A-Z0-9_-]+$/i,
    "Le code ne peut contenir que des lettres, chiffres, tirets et underscores."
  );

/**
 * PERCENTAGE, FIXED_AMOUNT (scope ORDER, niveau `simple`) +
 * FREE_SHIPPING (scope ORDER, niveau `rules`).
 * FREE_SHIPPING ne nécessite pas de valeur numérique : la remise annule
 * le coût de la méthode de livraison sélectionnée au moment du checkout.
 */
export const createDiscountSchema = z
  .object({
    code: discountCodeSchema,
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
    scopeType: z.enum(["ORDER", "PRODUCT", "PRODUCT_VARIANT", "CATEGORY"]),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
    isAutomatic: z.boolean(),
    priority: z
      .number()
      .int("La priorite doit etre un entier.")
      .min(0, "La priorite doit etre positive ou nulle."),
    percentageValue: z
      .number()
      .min(0, "Le pourcentage doit être positif.")
      .max(100, "Le pourcentage ne peut pas dépasser 100.")
      .nullable(),
    fixedAmountValue: z.number().min(0, "Le montant doit être positif.").nullable(),
    startsAt: z.date().nullable(),
    endsAt: z.date().nullable(),
    maxRedemptions: z
      .number()
      .int("Le nombre maximum d'utilisations doit être un entier.")
      .positive("Le nombre maximum d'utilisations doit être supérieur à 0.")
      .nullable(),
    maxRedemptionsPerCode: z
      .number()
      .int("Le nombre maximum d'utilisations par code doit etre un entier.")
      .positive("Le nombre maximum d'utilisations par code doit etre superieur a 0.")
      .nullable(),
    maxRedemptionsPerUser: z
      .number()
      .int("Le nombre maximum d'utilisations par client doit etre un entier.")
      .positive("Le nombre maximum d'utilisations par client doit etre superieur a 0.")
      .nullable(),
    discountCodes: z.array(discountCodeSchema).default([]),
    productIds: z.array(z.string().trim().min(1)).default([]),
    variantIds: z.array(z.string().trim().min(1)).default([]),
    categoryIds: z.array(z.string().trim().min(1)).default([]),
  })
  .refine(
    (data) => new Set([data.code.toUpperCase(), ...data.discountCodes.map((code) => code.toUpperCase())]).size === data.discountCodes.length + 1,
    {
      message: "Chaque code doit etre unique dans cette remise.",
      path: ["discountCodes"],
    }
  )
  .refine(
    (data) => (data.type === "PERCENTAGE" ? data.percentageValue !== null : true),
    { message: "Indiquez un pourcentage de remise.", path: ["percentageValue"] }
  )
  .refine(
    (data) => (data.type === "FIXED_AMOUNT" ? data.fixedAmountValue !== null : true),
    { message: "Indiquez un montant de remise.", path: ["fixedAmountValue"] }
  )
  .refine(
    (data) =>
      data.startsAt === null || data.endsAt === null || data.endsAt.getTime() >= data.startsAt.getTime(),
    {
      message: "La date de fin doit être postérieure à la date de début.",
      path: ["endsAt"],
    }
  )
  .refine(
    (data) => (data.scopeType === "PRODUCT" ? data.productIds.length > 0 : true),
    {
      message: "Sélectionnez au moins un produit cible.",
      path: ["productIds"],
    }
  )
  .refine(
    (data) => (data.scopeType === "PRODUCT_VARIANT" ? data.variantIds.length > 0 : true),
    {
      message: "Sélectionnez au moins une variante cible.",
      path: ["variantIds"],
    }
  )
  .refine(
    (data) => (data.scopeType === "CATEGORY" ? data.categoryIds.length > 0 : true),
    {
      message: "Sélectionnez au moins une catégorie cible.",
      path: ["categoryIds"],
    }
  )
  .refine(
    (data) =>
      data.scopeType === "ORDER" || data.type === "PERCENTAGE" || data.type === "FIXED_AMOUNT",
    {
      message: "Le ciblage catalogue ne gère pas la livraison offerte dans ce lot.",
      path: ["type"],
    }
  );

export type CreateDiscountInput = z.infer<typeof createDiscountSchema>;
