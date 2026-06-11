import { z } from "zod";

/**
 * Textes légaux système V1.
 * Chaque champ du formulaire correspond à une Page système (isSystemPage=true)
 * identifiée par son code, unique par boutique (@@unique([storeId, code])).
 */
export const LEGAL_PAGE_CODES = {
  legalNotice: "legal-notice",
  termsOfSale: "terms-of-sale",
  privacyPolicy: "privacy-policy",
  returnsPolicy: "returns-policy",
} as const;

export type LegalPageFieldKey = keyof typeof LEGAL_PAGE_CODES;
export type LegalPageCode = (typeof LEGAL_PAGE_CODES)[LegalPageFieldKey];

export const LEGAL_PAGE_TITLES: Record<LegalPageCode, string> = {
  "legal-notice": "Mentions légales",
  "terms-of-sale": "Conditions générales de vente",
  "privacy-policy": "Politique de confidentialité",
  "returns-policy": "Politique de retour",
};

export const LEGAL_BODY_MAX_LENGTH = 50_000;

const legalBody = z
  .string()
  .trim()
  .max(LEGAL_BODY_MAX_LENGTH, "Texte trop long (50 000 caractères max).");

export const legalSettingsSchema = z.object({
  legalNotice: legalBody,
  termsOfSale: legalBody,
  privacyPolicy: legalBody,
  returnsPolicy: legalBody,
});

export type LegalSettingsInput = z.infer<typeof legalSettingsSchema>;

export type LegalSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof LegalSettingsInput, string>>;
    };
