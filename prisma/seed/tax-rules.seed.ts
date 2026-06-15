import type { PrismaClient } from "@/prisma-generated/client";

/**
 * Taux de TVA standard par territoire (cf. commerce.taxation, vérifié 2026-06-14,
 * à valider expert-comptable). Scope STORE, prix TTC (isIncludedInPrice).
 * Guyane (973) et Mayotte (976) : exonérées → pas de règle (court-circuit à 0 %).
 * Taux réduits (10 / 5,5 / 2,1 %) : à créer via l'admin par ciblage catégorie.
 */
const STANDARD_TAX_RULES: ReadonlyArray<{
  code: string;
  name: string;
  regionCode: string | null;
  ratePercent: number;
}> = [
  { code: "FR-STD-METRO", name: "TVA standard métropole", regionCode: null, ratePercent: 20 },
  { code: "FR-STD-971", name: "TVA standard Guadeloupe", regionCode: "971", ratePercent: 8.5 },
  { code: "FR-STD-972", name: "TVA standard Martinique", regionCode: "972", ratePercent: 8.5 },
  { code: "FR-STD-974", name: "TVA standard Réunion", regionCode: "974", ratePercent: 8.5 },
];

export async function seedTaxRules(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  for (const rule of STANDARD_TAX_RULES) {
    await db.taxRule.upsert({
      where: { storeId_code: { storeId: store.id, code: rule.code } },
      update: {
        name: rule.name,
        status: "ACTIVE",
        ratePercent: rule.ratePercent,
        regionCode: rule.regionCode,
      },
      create: {
        storeId: store.id,
        code: rule.code,
        name: rule.name,
        status: "ACTIVE",
        scopeType: "STORE",
        countryCode: "FR",
        regionCode: rule.regionCode,
        ratePercent: rule.ratePercent,
        isIncludedInPrice: true,
      },
    });
  }
}
