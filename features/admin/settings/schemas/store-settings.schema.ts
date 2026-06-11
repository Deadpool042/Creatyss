import { z } from "zod";

export const CURRENCY_CODES = ["EUR", "USD", "GBP", "CHF", "CAD"] as const;
export type CurrencyCodeValue = (typeof CURRENCY_CODES)[number];

export const TIMEZONES = [
  "Europe/Paris",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
] as const;

export const storeSettingsSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
  legalName: z.string().max(150).optional().nullable(),
  siret: z.string().trim().max(20).optional().transform(v => !v || v === "" ? null : v).nullable(),
  vatNumber: z.string().trim().toUpperCase().max(20).optional().transform(v => !v || v === "" ? null : v).nullable(),
  supportEmail: z.email("Email invalide").max(200).optional().nullable().or(z.literal("")),
  supportPhone: z.string().max(30).optional().nullable(),
  shippingReturnsPolicy: z.string().max(2000).optional().nullable(),
  defaultCurrency: z.enum(CURRENCY_CODES),
  timezone: z.string().min(1),
  defaultLocaleCode: z.string().min(2).max(10),
  addressLine1: z.string().trim().max(150).nullable().optional().transform(v => v === "" ? null : v ?? null),
  addressCity: z.string().trim().max(100).nullable().optional().transform(v => v === "" ? null : v ?? null),
  addressPostalCode: z.string().trim().max(20).nullable().optional().transform(v => v === "" ? null : v ?? null),
  addressCountry: z.string().trim().max(80).nullable().optional().transform(v => v === "" ? null : v ?? null),
  instagramUrl: z.string().trim().url("URL invalide").or(z.literal("")).nullable().optional().transform(v => !v || v === "" ? null : v),
  facebookUrl: z.string().trim().url("URL invalide").or(z.literal("")).nullable().optional().transform(v => !v || v === "" ? null : v),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

export type StoreSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof StoreSettingsInput, string>>;
    };
