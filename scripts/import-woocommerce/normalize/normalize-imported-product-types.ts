import { createScriptPrismaClient } from "../../helpers/prisma-client";
import { ensureCanonicalProductTypes } from "../bootstrap/ensure-canonical-product-types";

type NormalizationCandidate = {
  id: string;
  slug: string;
  storeId: string;
  targetCode: "simple" | "variable";
  targetIsStandalone: boolean;
  variantCount: number;
  hasWooVariationReference: boolean;
};

function hasApplyFlag(argv: readonly string[]): boolean {
  return argv.includes("--apply");
}

function printSummary(candidates: readonly NormalizationCandidate[]): void {
  const simpleCount = candidates.filter((item) => item.targetCode === "simple").length;
  const variableCount = candidates.filter((item) => item.targetCode === "variable").length;

  process.stdout.write(
    [
      `Candidats total: ${candidates.length}`,
      `Cible simple: ${simpleCount}`,
      `Cible variable: ${variableCount}`,
    ].join("\n") + "\n"
  );
}

async function main(): Promise<void> {
  const prisma = createScriptPrismaClient();
  const apply = hasApplyFlag(process.argv.slice(2));

  try {
    const wooProductTypes = await prisma.productType.findMany({
      where: {
        code: "woo-imported",
        archivedAt: null,
      },
      select: {
        id: true,
        storeId: true,
      },
    });

    if (wooProductTypes.length === 0) {
      process.stdout.write("Aucun ProductType woo-imported actif détecté.\n");
      return;
    }

    const wooTypeIds = wooProductTypes.map((item) => item.id);

    const products = await prisma.product.findMany({
      where: {
        productTypeId: {
          in: wooTypeIds,
        },
      },
      select: {
        id: true,
        slug: true,
        storeId: true,
        variants: {
          where: {
            archivedAt: null,
          },
          select: {
            externalReference: true,
          },
        },
      },
      orderBy: {
        slug: "asc",
      },
    });

    if (products.length === 0) {
      process.stdout.write("Aucun produit rattaché à woo-imported à normaliser.\n");
      return;
    }

    const optionLinksCount = await prisma.productVariantOptionValue.count({
      where: {
        variant: {
          productId: {
            in: products.map((item) => item.id),
          },
        },
      },
    });

    if (optionLinksCount > 0) {
      throw new Error(
        `Normalisation interrompue: ${optionLinksCount} liens option/variante détectés. Migration explicite des axes requise avant changement de productType.`
      );
    }

    const candidates: NormalizationCandidate[] = products.map((product) => {
      const variantCount = product.variants.length;
      const hasWooVariationReference = product.variants.some((variant) =>
        (variant.externalReference ?? "").startsWith("woo_variation:")
      );
      const targetCode =
        variantCount > 1 || hasWooVariationReference ? "variable" : "simple";

      return {
        id: product.id,
        slug: product.slug,
        storeId: product.storeId,
        targetCode,
        targetIsStandalone: targetCode === "simple",
        variantCount,
        hasWooVariationReference,
      };
    });

    printSummary(candidates);

    if (!apply) {
      process.stdout.write(
        "Dry-run terminé. Relancer avec --apply pour appliquer la normalisation.\n"
      );
      return;
    }

    const canonicalByStore = new Map<
      string,
      {
        simpleId: string;
        variableId: string;
      }
    >();

    const storeIds = [...new Set(candidates.map((item) => item.storeId))];

    for (const storeId of storeIds) {
      const canonical = await ensureCanonicalProductTypes(prisma, storeId);
      canonicalByStore.set(storeId, {
        simpleId: canonical.simple.id,
        variableId: canonical.variable.id,
      });
    }

    for (const candidate of candidates) {
      const canonical = canonicalByStore.get(candidate.storeId);

      if (!canonical) {
        throw new Error(`Types canoniques introuvables pour store ${candidate.storeId}`);
      }

      const targetProductTypeId =
        candidate.targetCode === "simple" ? canonical.simpleId : canonical.variableId;

      await prisma.product.update({
        where: {
          id: candidate.id,
        },
        data: {
          productTypeId: targetProductTypeId,
          isStandalone: candidate.targetIsStandalone,
        },
      });
    }

    process.stdout.write(`Normalisation appliquée sur ${candidates.length} produit(s).\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Erreur de normalisation inconnue.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
