import { z } from "zod";

export const ADMIN_EDITORIAL_PAGE_BODY_MAX_LENGTH = 50_000;
export const ADMIN_EDITORIAL_PAGE_TITLE_MAX_LENGTH = 200;
export const ADMIN_EDITORIAL_PAGE_SLUG_MAX_LENGTH = 100;
export const ADMIN_EDITORIAL_PAGE_EXCERPT_MAX_LENGTH = 400;

export const adminEditorialPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Le titre est obligatoire.")
    .max(ADMIN_EDITORIAL_PAGE_TITLE_MAX_LENGTH, "Titre trop long (200 caractères max)."),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est obligatoire.")
    .max(ADMIN_EDITORIAL_PAGE_SLUG_MAX_LENGTH, "Slug trop long (100 caractères max).")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug invalide : minuscules, chiffres et tirets uniquement (ex. ma-page)."
    ),
  excerpt: z
    .string()
    .trim()
    .max(
      ADMIN_EDITORIAL_PAGE_EXCERPT_MAX_LENGTH,
      `Résumé trop long (${ADMIN_EDITORIAL_PAGE_EXCERPT_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .max(
      ADMIN_EDITORIAL_PAGE_BODY_MAX_LENGTH,
      `Contenu trop long (${ADMIN_EDITORIAL_PAGE_BODY_MAX_LENGTH} caractères max).`
    )
    .optional()
    .or(z.literal("")),
});

export type AdminEditorialPageInput = z.infer<typeof adminEditorialPageSchema>;

export type AdminEditorialPageFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<keyof AdminEditorialPageInput, string>> };
