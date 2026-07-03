import { z } from "zod";

export const createShippingZoneSchema = z.object({
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
  description: z
    .string()
    .trim()
    .max(400, "La description est trop longue (400 caractères maximum).")
    .optional(),
});

export type CreateShippingZoneInput = z.infer<typeof createShippingZoneSchema>;

export const updateShippingZoneSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(120, "Le nom est trop long (120 caractères maximum)."),
  description: z
    .string()
    .trim()
    .max(400, "La description est trop longue (400 caractères maximum).")
    .optional(),
});

export type UpdateShippingZoneInput = z.infer<typeof updateShippingZoneSchema>;
