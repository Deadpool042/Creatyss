import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { LEGAL_PAGE_CODES } from "@/features/admin/settings/schemas/legal-settings.schema";

export type AdminLegalSettings = {
  legalNotice: string;
  termsOfSale: string;
  privacyPolicy: string;
  returnsPolicy: string;
};

/**
 * Charge les 4 textes légaux système depuis les Pages système.
 * Ne crée rien : les pages absentes sont retournées comme texte vide.
 * La création se fait uniquement à la sauvegarde (action, upsert).
 */
export async function getAdminLegalSettings(): Promise<AdminLegalSettings | null> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) return null;

  const rows = await db.page.findMany({
    where: {
      storeId,
      code: { in: Object.values(LEGAL_PAGE_CODES) },
      isSystemPage: true,
    },
    select: {
      code: true,
      body: true,
    },
  });

  const bodyByCode = new Map(rows.map((row) => [row.code, row.body ?? ""]));

  return {
    legalNotice: bodyByCode.get(LEGAL_PAGE_CODES.legalNotice) ?? "",
    termsOfSale: bodyByCode.get(LEGAL_PAGE_CODES.termsOfSale) ?? "",
    privacyPolicy: bodyByCode.get(LEGAL_PAGE_CODES.privacyPolicy) ?? "",
    returnsPolicy: bodyByCode.get(LEGAL_PAGE_CODES.returnsPolicy) ?? "",
  };
}
