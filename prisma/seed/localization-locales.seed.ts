import type { PrismaClient } from "@/prisma-generated/client";

/**
 * Lot 2 — `localization` L1 managed (cf.
 * docs/lots/2026-06-12-localization-l1-cadrage.md, lot 2).
 *
 * Bootstrap la locale par défaut comme donnée gérée : une `LocalizationLocale`
 * `isDefault: true` cohérente avec `Store.defaultLocaleCode`. C'est le socle
 * de l'admin minimal (liste + défaut) — indépendant de l'activation du flag
 * `platform.localization`.
 *
 * Lot 4 sous-lot 1 — `localization` L2 multilingual (cf.
 * docs/lots/2026-06-13-localization-l2-cadrage.md, sous-lot 1).
 *
 * Seed également une seconde locale gérée (`SECONDARY_LOCALE_CODE`),
 * `ACTIVE` mais `isDefault: false` : premier cas concret d'une boutique
 * multi-locales gérées, nécessaire pour exercer le fallback de
 * `resolveLocalizedValue` (lot 4 sous-lot 2). Zéro impact comportemental —
 * le flag `platform.localization` reste DRAFT et aucun écran ne lit encore
 * `LocalizedValue`.
 */

const SECONDARY_LOCALE_CODE = "en-GB";

const LOCALE_LABELS: Record<string, string> = {
  "fr-FR": "Français (France)",
  "fr-BE": "Français (Belgique)",
  "fr-CH": "Français (Suisse)",
  "en-GB": "English (UK)",
  "en-US": "English (US)",
  "de-DE": "Deutsch",
  "es-ES": "Español",
};

function splitLocaleCode(code: string): { languageCode: string; countryCode: string | null } {
  const [languageCode, countryCode] = code.split("-");
  return {
    languageCode: (languageCode ?? code).toLowerCase(),
    countryCode: countryCode ? countryCode.toUpperCase() : null,
  };
}

export async function seedLocalizationLocales(db: PrismaClient): Promise<void> {
  const store = await db.store.findFirst({
    select: { id: true, defaultLocaleCode: true },
    orderBy: { createdAt: "asc" },
  });

  if (!store) {
    return;
  }

  const { languageCode, countryCode } = splitLocaleCode(store.defaultLocaleCode);
  const name = LOCALE_LABELS[store.defaultLocaleCode] ?? store.defaultLocaleCode;

  await db.localizationLocale.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: store.defaultLocaleCode,
      },
    },
    update: {
      isDefault: true,
      status: "ACTIVE",
    },
    create: {
      storeId: store.id,
      code: store.defaultLocaleCode,
      languageCode,
      countryCode,
      name,
      status: "ACTIVE",
      isDefault: true,
    },
  });

  // Garantit l'unicité de la locale par défaut si une autre locale du store
  // portait déjà ce statut (ex. ré-exécution après changement de
  // Store.defaultLocaleCode).
  await db.localizationLocale.updateMany({
    where: {
      storeId: store.id,
      code: { not: store.defaultLocaleCode },
      isDefault: true,
    },
    data: { isDefault: false },
  });

  await seedSecondaryLocale(db, store);
}

/**
 * Seconde locale gérée, non par défaut (lot 4 sous-lot 1). Idempotent et
 * non destructif : `update: {}` ne touche pas une locale déjà présente,
 * pour ne pas écraser un choix admin ultérieur (ex. promue par défaut via
 * `set-default-localization-locale`).
 */
async function seedSecondaryLocale(
  db: PrismaClient,
  store: { id: string; defaultLocaleCode: string }
): Promise<void> {
  if (store.defaultLocaleCode === SECONDARY_LOCALE_CODE) {
    return;
  }

  const { languageCode, countryCode } = splitLocaleCode(SECONDARY_LOCALE_CODE);
  const name = LOCALE_LABELS[SECONDARY_LOCALE_CODE] ?? SECONDARY_LOCALE_CODE;

  await db.localizationLocale.upsert({
    where: {
      storeId_code: {
        storeId: store.id,
        code: SECONDARY_LOCALE_CODE,
      },
    },
    update: {},
    create: {
      storeId: store.id,
      code: SECONDARY_LOCALE_CODE,
      languageCode,
      countryCode,
      name,
      status: "ACTIVE",
      isDefault: false,
    },
  });
}
