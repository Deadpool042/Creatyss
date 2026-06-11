/**
 * Routes publiques des pages système légales, par code Prisma.
 * Doit rester aligné avec app/(public) et prisma/seed/legal-pages.seed.ts.
 */
export const PUBLIC_LEGAL_PATHS: Record<string, string> = {
  "legal-notice": "/mentions-legales",
  "terms-of-sale": "/conditions-generales-de-vente",
  "privacy-policy": "/politique-confidentialite",
  "returns-policy": "/politique-retour",
};
