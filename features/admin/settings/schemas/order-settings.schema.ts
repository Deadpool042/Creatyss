import { z } from "zod";

export const orderSettingsSchema = z.object({
  orderNumberPrefix: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(
      z
        .string()
        .min(1, "Le préfixe ne peut pas être vide")
        .max(10, "Le préfixe ne peut pas dépasser 10 caractères")
        .regex(/^[A-Z0-9]+$/, "Lettres majuscules et chiffres uniquement")
    )
    .nullable()
    .optional(),
});

export type OrderSettingsInput = z.infer<typeof orderSettingsSchema>;

export type OrderSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof OrderSettingsInput, string>>;
    };
