import { z } from "zod";

export const PaymentSettingsSchema = z.object({
  bankTransferEnabled: z.coerce.boolean(),
  cashOnDeliveryEnabled: z.coerce.boolean(),
  bankTransferInstructions: z
    .string()
    .trim()
    .max(1000)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  cashOnDeliveryInstructions: z
    .string()
    .trim()
    .max(1000)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
});

export type PaymentSettingsInput = z.infer<typeof PaymentSettingsSchema>;

export type PaymentSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof PaymentSettingsInput, string>>;
    };
