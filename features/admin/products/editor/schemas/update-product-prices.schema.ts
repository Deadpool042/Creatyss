import { z } from "zod";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : YYYY-MM-DD")
  .nullable()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v.trim() : null));

export const priceEntrySchema = z
  .object({
    priceListId: z.string().min(1),
    amount: z.string().min(1),
    compareAtAmount: z.string().nullable().optional(),
    costAmount: z.string().nullable().optional(),
    startsAt: dateStringSchema,
    endsAt: dateStringSchema,
  })
  .superRefine((data, ctx) => {
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
