import { db } from "@/core/db";

/**
 * Codes des Pages système légales exposées publiquement.
 * Codes dupliqués côté storefront pour éviter une dépendance vers l'admin.
 */
export const PUBLIC_SYSTEM_PAGE_CODES = [
  "legal-notice",
  "terms-of-sale",
  "privacy-policy",
  "returns-policy",
] as const;

export type PublicSystemPageCode = (typeof PUBLIC_SYSTEM_PAGE_CODES)[number];

export type PublicSystemPage = {
  title: string;
  body: string;
  updatedAt: Date;
};

/**
 * Lit une Page système publiée par son code.
 * Retourne null si la page est absente, inactive ou sans contenu.
 */
export async function getPublicSystemPage(
  code: PublicSystemPageCode
): Promise<PublicSystemPage | null> {
  const page = await db.page.findFirst({
    where: {
      code,
      isSystemPage: true,
      status: "ACTIVE",
    },
    select: {
      title: true,
      body: true,
      updatedAt: true,
    },
  });

  if (page === null) return null;

  const body = page.body?.trim() ?? "";

  if (body === "") return null;

  return {
    title: page.title,
    body,
    updatedAt: page.updatedAt,
  };
}
