import { z } from "zod";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD")
  .nullable()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v.trim() : null));

function parseMoneyInput(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (normalized.length === 0) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

const moneyNumberSchema = z
  .string()
  .transform((value) => parseMoneyInput(value))
  .superRefine((value, ctx) => {
    if (value === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Montant invalide. Exemple attendu : 129.00",
      });
    }
  })
  .transform((value) => value as number);

const optionalMoneyNumberSchema = z
  .string()
  .nullable()
  .optional()
  .transform((value) => (value ?? "").trim())
  .superRefine((value, ctx) => {
    if (value.length === 0) {
      return;
    }

    const parsed = parseMoneyInput(value);
    if (parsed === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Montant invalide. Exemple attendu : 149.00",
      });
    }
  })
  .transform((value) => {
    if (value.length === 0) return null;
    return parseMoneyInput(value);
  })
  .transform((value) => value as number | null);

export const priceEntrySchema = z
  .object({
    priceListId: z.string().min(1),
    amount: moneyNumberSchema,
    compareAtAmount: optionalMoneyNumberSchema,
    costAmount: z.string().nullable().optional(),
    startsAt: dateStringSchema,
    endsAt: dateStringSchema,
  })
  .superRefine((data, ctx) => {
    if (data.compareAtAmount !== null && data.compareAtAmount < data.amount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Le prix barré doit être supérieur ou égal au prix actuel",
        path: ["compareAtAmount"],
      });
    }

    if (data.startsAt && data.endsAt) {
      if (new Date(data.endsAt) < new Date(data.startsAt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La date de fin doit être postérieure à la date de début",
          path: ["endsAt"],
        });
      }
    }
  });

export type PriceEntrySchema = z.infer<typeof priceEntrySchema>;
