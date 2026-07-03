import { z } from "zod";

const amountField = z.coerce.number().min(0).max(9999.99);

const optionalAmountField = z
  .union([z.literal(""), amountField])
  .transform((v) => (v === "" ? null : v))
  .optional();

const SUBTOTAL_RANGE_ERROR = {
  message: "Le seuil minimum doit être inférieur ou égal au seuil maximum.",
  path: ["maxSubtotalAmount"] as string[],
};

function hasValidSubtotalRange(data: {
  minSubtotalAmount?: number | null | undefined;
  maxSubtotalAmount?: number | null | undefined;
}): boolean {
  if (data.minSubtotalAmount == null || data.maxSubtotalAmount == null) {
    return true;
  }
  return data.minSubtotalAmount <= data.maxSubtotalAmount;
}

export const createShippingMethodSchema = z
  .object({
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
    shippingZoneId: z.string().min(1, "Zone requise."),
    amount: amountField,
    currencyCode: z.enum(["EUR", "USD", "GBP", "CHF", "CAD"]),
    minSubtotalAmount: optionalAmountField,
    maxSubtotalAmount: optionalAmountField,
    isDefault: z.coerce.boolean().optional().default(false),
  })
  .refine(hasValidSubtotalRange, SUBTOTAL_RANGE_ERROR);

export type CreateShippingMethodInput = z.infer<typeof createShippingMethodSchema>;

export const updateShippingMethodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(120, "Le nom est trop long (120 caractères maximum)."),
    amount: amountField,
    minSubtotalAmount: optionalAmountField,
    maxSubtotalAmount: optionalAmountField,
    isDefault: z.coerce.boolean().optional().default(false),
  })
  .refine(hasValidSubtotalRange, SUBTOTAL_RANGE_ERROR);

export type UpdateShippingMethodInput = z.infer<typeof updateShippingMethodSchema>;
