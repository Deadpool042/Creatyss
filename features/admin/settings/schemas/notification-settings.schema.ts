import { z } from "zod";

export const NotificationSettingsSchema = z.object({
  emailConfirmationEnabled: z.coerce.boolean(),
  emailShippingEnabled: z.coerce.boolean(),
  replyToEmail: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Adresse email invalide.",
    })
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
});

export type NotificationSettingsInput = z.infer<typeof NotificationSettingsSchema>;

export type NotificationSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof NotificationSettingsInput, string>>;
    };
