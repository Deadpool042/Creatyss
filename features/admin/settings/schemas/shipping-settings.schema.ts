import { z } from "zod";

export const shippingSettingsSchema = z.object({
  standardShippingAmount: z.coerce.number().min(0).max(9999.99),
  freeShippingThreshold: z
    .union([z.literal(""), z.coerce.number().min(0).max(9999.99)])
    .transform((v) => (v === "" ? null : v)),
  currencyCode: z.string().min(1),
});

export type ShippingSettingsInput = z.infer<typeof shippingSettingsSchema>;

export type ShippingSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof ShippingSettingsInput, string>>;
    };
