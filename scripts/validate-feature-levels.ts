/**
 * Vérifie que chaque feature graduée du FEATURE_CATALOG a, en base, un
 * FeatureFlag.allowedLevels strictement égal aux niveaux déclarés dans
 * FEATURE_LEVELS (même ensemble, même ordre). Détecte la dérive DB/code
 * observée dans docs/audit/2026-07-03-audit-feature-levels.md (seed modifié
 * mais jamais rejoué sur l'environnement).
 *
 * N'échoue pas sur les features sans `levels` déclaré (atomiques par
 * design — cf. feature-governance.md, « Propositions sans gradation runtime
 * observée »).
 */
import { FEATURE_CATALOG } from "../features/admin/pilotage/catalog/feature-catalog";
import { createScriptPrismaClient } from "./helpers/prisma-client";

const db = createScriptPrismaClient();

function levelsMatch(declared: readonly string[], actual: readonly string[]): boolean {
  if (declared.length !== actual.length) return false;
  return declared.every((level, index) => actual[index] === level);
}

async function main(): Promise<void> {
  const gradedEntries = FEATURE_CATALOG.filter(
    (entry): entry is typeof entry & { levels: readonly string[] } =>
      "levels" in entry && entry.levels !== undefined && entry.levels.length > 0
  );

  const codes = gradedEntries.map((entry) => entry.key);
  const flags = await db.featureFlag.findMany({
    where: { code: { in: codes } },
    select: { code: true, allowedLevels: true, defaultLevel: true },
  });
  const flagsByCode = new Map(flags.map((flag) => [flag.code, flag]));

  let hasError = false;

  for (const entry of gradedEntries) {
    const flag = flagsByCode.get(entry.key);

    if (!flag) {
      hasError = true;
      console.error(`✗ ${entry.key} — aucun FeatureFlag en base (seed jamais joué ?)`);
      continue;
    }

    if (!levelsMatch(entry.levels, flag.allowedLevels)) {
      hasError = true;
      console.error(
        `✗ ${entry.key} — allowedLevels en base [${flag.allowedLevels.join(", ")}] ≠ FEATURE_LEVELS [${entry.levels.join(", ")}]`
      );
      continue;
    }

    if (flag.defaultLevel === null || !entry.levels.includes(flag.defaultLevel)) {
      hasError = true;
      console.error(`✗ ${entry.key} — defaultLevel invalide en base : ${flag.defaultLevel}`);
      continue;
    }

    console.info(
      `✓ ${entry.key} — ${flag.allowedLevels.join(" → ")} (défaut: ${flag.defaultLevel})`
    );
  }

  if (hasError) {
    console.error(
      "\nDérive détectée — rejouer `pnpm run db:seed:flags` sur cet environnement puis relancer ce script."
    );
    process.exitCode = 1;
    return;
  }

  console.info(`\n${gradedEntries.length} features graduées cohérentes entre code et base.`);
}

main()
  .catch((error: unknown) => {
    console.error("Validation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
