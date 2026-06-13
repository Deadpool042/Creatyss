import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

/**
 * Lot 4 sous-lot 3 — `localization` L2 multilingual, sélecteur de langue
 * storefront (cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Variante storefront de `listAdminLocalizationLocales` : uniquement les
 * locales `ACTIVE` du store courant, triées avec la locale par défaut en
 * tête.
 */

export type ActiveLocalizationLocale = {
  id: string;
  code: string;
  languageCode: string;
  countryCode: string | null;
  name: string;
  isDefault: boolean;
};

export async function listActiveLocalizationLocales(): Promise<ActiveLocalizationLocale[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  return db.localizationLocale.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    orderBy: [{ isDefault: "desc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      languageCode: true,
      countryCode: true,
      name: true,
      isDefault: true,
    },
  });
}
