import { db } from "@/core/db";
import {
  determineFrenchTaxTerritory,
  isVatExemptTerritory,
  taxRuleMatchKey,
  type FrenchTaxTerritory,
} from "@/entities/tax/tax-territory";

export class TaxRateResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaxRateResolutionError";
  }
}

export type ResolveTaxRateInput = {
  storeId: string;
  postalCode: string;
  productId?: string | null;
  variantId?: string | null;
  categoryIds?: readonly string[];
};

export type ResolvedTaxRate = {
  ratePercent: number;
  territory: FrenchTaxTerritory;
};

// Spécificité décroissante (cf. cadrage taxation D3).
const SCOPE_PRIORITY = ["PRODUCT_VARIANT", "PRODUCT", "CATEGORY", "STORE"] as const;

/**
 * Résout le taux de TVA applicable à une ligne pour un territoire donné.
 * - Territoire indéterminé (CP hors champ) → erreur bloquante.
 * - Territoire exonéré (Guyane/Mayotte) → 0 %.
 * - Sinon : `TaxRule` la plus spécifique ; aucune → erreur bloquante.
 */
export async function resolveTaxRate(input: ResolveTaxRateInput): Promise<ResolvedTaxRate> {
  const territory = determineFrenchTaxTerritory(input.postalCode);

  if (territory === null) {
    throw new TaxRateResolutionError(
      `Territoire fiscal indéterminé pour le code postal « ${input.postalCode} ».`
    );
  }

  if (isVatExemptTerritory(territory)) {
    return { ratePercent: 0, territory };
  }

  const { countryCode, regionCode } = taxRuleMatchKey(territory);
  const now = new Date();

  const rules = await db.taxRule.findMany({
    where: {
      storeId: input.storeId,
      status: "ACTIVE",
      countryCode,
      regionCode,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    select: {
      scopeType: true,
      ratePercent: true,
      productTargets: { select: { productId: true } },
      variantTargets: { select: { variantId: true } },
      categoryTargets: { select: { categoryId: true } },
    },
  });

  const categoryIds = new Set(input.categoryIds ?? []);

  for (const scope of SCOPE_PRIORITY) {
    const match = rules.find((rule) => {
      if (rule.scopeType !== scope) {
        return false;
      }
      switch (scope) {
        case "PRODUCT_VARIANT":
          return (
            input.variantId != null &&
            rule.variantTargets.some((t) => t.variantId === input.variantId)
          );
        case "PRODUCT":
          return (
            input.productId != null &&
            rule.productTargets.some((t) => t.productId === input.productId)
          );
        case "CATEGORY":
          return rule.categoryTargets.some((t) => categoryIds.has(t.categoryId));
        case "STORE":
          return true;
        default:
          return false;
      }
    });

    if (match !== undefined) {
      return { ratePercent: Number(match.ratePercent), territory };
    }
  }

  throw new TaxRateResolutionError(
    `Aucune règle de TVA applicable (territoire ${territory}, store ${input.storeId}).`
  );
}
