import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminLocalizationLocaleSummary = {
  id: string;
  code: string;
  languageCode: string;
  countryCode: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isDefault: boolean;
};

/**
 * Liste des locales gérées du store courant (lot 2 — `localization` L1
 * managed, cf. docs/lots/2026-06-12-localization-l1-cadrage.md).
 */
export async function listAdminLocalizationLocales(): Promise<AdminLocalizationLocaleSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const locales = await db.localizationLocale.findMany({
    where: { storeId, archivedAt: null },
    orderBy: [{ isDefault: "desc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      languageCode: true,
      countryCode: true,
      name: true,
      status: true,
      isDefault: true,
    },
  });

  return locales.map((locale) => ({
    id: locale.id,
    code: locale.code,
    languageCode: locale.languageCode,
    countryCode: locale.countryCode,
    name: locale.name,
    status: locale.status as AdminLocalizationLocaleSummary["status"],
    isDefault: locale.isDefault,
  }));
}
