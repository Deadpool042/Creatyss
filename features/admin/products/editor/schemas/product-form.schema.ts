import { z } from "zod";

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v));

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

export const productVariantFormSchema = z.object({
  variantId: z.string().optional().default(""),
  productId: z.string().trim().min(1),
  name: z.string().optional().default(""),
  slug: z.string().optional().default(""),
  sku: z.string().trim().min(1),
  status: z.enum(["draft", "active", "inactive", "archived"]),
  isDefault: z.enum(["true", "false"]).default("false"),
  sortOrder: z.string().trim().min(1),
  primaryImageId: z.string().optional().default(""),
  barcode: z.string().optional().default(""),
  externalReference: z.string().optional().default(""),
  weightGrams: z.string().optional().default(""),
  widthMm: z.string().optional().default(""),
  heightMm: z.string().optional().default(""),
  depthMm: z.string().optional().default(""),
});

export const productSeoFormSchema = z.object({
  productId: z.string().trim().min(1),
  title: z.string().trim().max(255, "Le titre SEO est trop long (max 255 car.).").default(""),
  description: z
    .string()
    .trim()
    .max(320, "La description SEO est trop longue (max 320 car.).")
    .default(""),
  canonicalPath: emptyToNull.refine((v) => v === null || v.startsWith("/"), {
    message: "Le chemin canonique doit commencer par '/'.",
  }),
  indexingMode: z.enum(["INDEX_FOLLOW", "INDEX_NOFOLLOW", "NOINDEX_FOLLOW", "NOINDEX_NOFOLLOW"]),
  sitemapIncluded: z.enum(["true", "false"]).default("true"),
  openGraphTitle: z
    .string()
    .trim()
    .max(255, "Le titre Open Graph est trop long (max 255 car.).")
    .default(""),
  openGraphDescription: z
    .string()
    .trim()
    .max(320, "La description Open Graph est trop longue (max 320 car.).")
    .default(""),
  openGraphImageId: emptyToNull,
  twitterTitle: z
    .string()
    .trim()
    .max(255, "Le titre réseau social est trop long (max 255 car.).")
    .default(""),
  twitterDescription: z
    .string()
    .trim()
    .max(320, "La description réseau social est trop longue (max 320 car.).")
    .default(""),
  twitterImageId: emptyToNull,
});

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

export type ProductVariantFormSchema = z.infer<typeof productVariantFormSchema>;
export type ProductSeoFormSchema = z.infer<typeof productSeoFormSchema>;
export type PriceEntrySchema = z.infer<typeof priceEntrySchema>;
