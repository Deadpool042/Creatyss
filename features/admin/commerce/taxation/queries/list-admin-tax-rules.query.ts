import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { AdminTaxRuleSummary } from "@/features/admin/commerce/taxation/types/admin-tax-rule.types";

/** Liste les `TaxRule` du store courant (non archivées) pour l'admin TVA. */
export async function listAdminTaxRules(): Promise<AdminTaxRuleSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const rules = await db.taxRule.findMany({
    where: { storeId, archivedAt: null },
    orderBy: [{ regionCode: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      status: true,
      scopeType: true,
      countryCode: true,
      regionCode: true,
      ratePercent: true,
      isIncludedInPrice: true,
      createdAt: true,
    },
  });

  return rules.map((rule) => ({
    ...rule,
    ratePercent: rule.ratePercent.toNumber(),
  }));
}
