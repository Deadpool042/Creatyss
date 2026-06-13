/**
 * Active le niveau `multilingual` du flag gradué `platform.localization`
 * pour le premier store (même store que `prisma/seed/localization-feature-flag.seed.ts`
 * et `prisma/seed/localization-locales.seed.ts`).
 *
 * Sert à tester le pilote homepage multilingue (lot 4, cf.
 * docs/lots/2026-06-13-localization-l2-cadrage.md) : sélecteur de langue
 * storefront visible, admin de traduction `/admin/settings/localization/translations`
 * accessible, `getLocalizedHomepageCopy` applique les overrides de la
 * locale secondaire.
 *
 * Par défaut : dry-run, affiche l'état actuel sans rien écrire.
 *   pnpm tsx scripts/enable-localization-multilingual.ts
 *
 * Pour appliquer :
 *   pnpm tsx scripts/enable-localization-multilingual.ts --apply
 *
 * Pour revenir à l'état initial (flag DRAFT, override désactivé) :
 *   pnpm tsx scripts/enable-localization-multilingual.ts --revert
 */
import { createScriptPrismaClient } from "./helpers/prisma-client";

const FEATURE_CODE = "platform.localization";
const TARGET_LEVEL = "multilingual";
const OVERRIDE_REASON_CODE = "test-multilingual-pilot";

const prisma = createScriptPrismaClient();

type CliOptions = {
  apply: boolean;
  revert: boolean;
};

function parseCliOptions(argv: readonly string[]): CliOptions {
  return {
    apply: argv.includes("--apply"),
    revert: argv.includes("--revert"),
  };
}

function maskedDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "(absent)";
  return raw.replace(/:\/\/[^@]+@/, "://***@");
}

async function main(): Promise<void> {
  const { apply, revert } = parseCliOptions(process.argv.slice(2));

  if (apply && revert) {
    throw new Error("--apply et --revert sont exclusifs.");
  }

  console.info(`DATABASE_URL : ${maskedDatabaseUrl()}`);

  const store = await prisma.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, code: true, name: true },
  });

  if (!store) {
    console.info("Aucun store trouvé — rien à faire.");
    return;
  }

  console.info(`Store cible : ${store.id} | ${store.code} | ${store.name}`);

  const flag = await prisma.featureFlag.findUnique({
    where: { storeId_code: { storeId: store.id, code: FEATURE_CODE } },
    select: { id: true, status: true, allowedLevels: true, defaultLevel: true },
  });

  if (!flag) {
    console.info(
      `Flag "${FEATURE_CODE}" introuvable pour ce store — exécuter "pnpm run db:seed" d'abord.`
    );
    return;
  }

  if (!flag.allowedLevels.includes(TARGET_LEVEL)) {
    throw new Error(
      `Le niveau "${TARGET_LEVEL}" n'est pas dans allowedLevels (${flag.allowedLevels.join(", ")}).`
    );
  }

  const override = await prisma.featureFlagOverride.findUnique({
    where: {
      featureFlagId_scopeType_scopeId: {
        featureFlagId: flag.id,
        scopeType: "STORE",
        scopeId: store.id,
      },
    },
    select: { id: true, isEnabled: true, level: true, archivedAt: true },
  });

  console.info(
    `État actuel — flag.status=${flag.status}, flag.defaultLevel=${flag.defaultLevel}, ` +
      `override=${override ? `{isEnabled: ${override.isEnabled}, level: ${override.level}, archivedAt: ${override.archivedAt}}` : "absent"}`
  );

  if (!apply && !revert) {
    console.info("Dry-run — aucune écriture. Relancer avec --apply ou --revert.");
    return;
  }

  if (revert) {
    await prisma.featureFlag.update({
      where: { id: flag.id },
      data: { status: "DRAFT" },
    });

    if (override) {
      await prisma.featureFlagOverride.update({
        where: { id: override.id },
        data: { isEnabled: false, level: null, archivedAt: new Date() },
      });
    }

    console.info(`OK — flag "${FEATURE_CODE}" remis en DRAFT, override désactivé.`);
    return;
  }

  await prisma.featureFlag.update({
    where: { id: flag.id },
    data: { status: "ACTIVE" },
  });

  await prisma.featureFlagOverride.upsert({
    where: {
      featureFlagId_scopeType_scopeId: {
        featureFlagId: flag.id,
        scopeType: "STORE",
        scopeId: store.id,
      },
    },
    update: {
      isEnabled: true,
      level: TARGET_LEVEL,
      archivedAt: null,
      reasonCode: OVERRIDE_REASON_CODE,
    },
    create: {
      featureFlagId: flag.id,
      scopeType: "STORE",
      scopeId: store.id,
      isEnabled: true,
      level: TARGET_LEVEL,
      reasonCode: OVERRIDE_REASON_CODE,
      notes: "Activation manuelle pour tester le pilote homepage multilingue (lot 4).",
    },
  });

  console.info(
    `OK — flag "${FEATURE_CODE}" ACTIVE, override STORE/${store.id} → level="${TARGET_LEVEL}".`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
