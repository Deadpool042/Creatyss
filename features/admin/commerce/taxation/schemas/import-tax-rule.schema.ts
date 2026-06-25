import { z } from "zod";

/**
 * Colonnes CSV acceptées pour l'import de règles TVA (scope STORE uniquement).
 * En-têtes attendus : code,name,countryCode,regionCode,ratePercent,startsAt,endsAt,status
 *
 * - regionCode   : vide ou absent → null (métropole) ; sinon 971/972/973/974/976 (DOM).
 * - ratePercent  : nombre en chaîne ("20", "8.5", "0").
 * - startsAt/endsAt : ISO 8601 ou vide.
 * - status       : DRAFT | ACTIVE | INACTIVE — défaut DRAFT si absent.
 */

const DOM_REGION_CODES = ["971", "972", "973", "974", "976"] as const;

export const csvTaxRuleRowSchema = z.object({
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
  countryCode: z
    .string()
    .trim()
    .length(2, "Le code pays doit faire exactement 2 caractères.")
    .toUpperCase(),
  regionCode: z.preprocess(
    (v) => (v == null || (typeof v === "string" && v.trim() === "") ? null : v),
    z.enum(DOM_REGION_CODES).nullable()
  ),
  ratePercent: z.coerce
    .number()
    .min(0, "Le taux doit être positif ou nul.")
    .max(100, "Le taux ne peut pas dépasser 100."),
  startsAt: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().optional()
  ),
  endsAt: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().optional()
  ),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("DRAFT"),
});

export type CsvTaxRuleRow = z.infer<typeof csvTaxRuleRowSchema>;
