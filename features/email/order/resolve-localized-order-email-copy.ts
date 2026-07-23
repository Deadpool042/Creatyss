import "server-only";

import { db } from "@/core/db";
import {
  ORDER_EMAIL_COPY_SUBJECT_TYPE,
  getOrderEmailCopyFields,
  type OrderEmailCopyEventType,
} from "@/entities/localization/order-email-copy-fields";
import {
  resolveLocalizedValue,
  type LocalizedValueCandidate,
} from "@/entities/localization/resolve-localized-value";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

import type { OrderEmailCopyOverrides } from "./order-email-templates";

const EMPTY_OVERRIDES: OrderEmailCopyOverrides = {};

/**
 * Résout les overrides de traduction pour un email transactionnel de
 * commande (Horizon 4 — lot multilingue généralisé, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Même pattern de résolution que `getLocalizedHomepageCopy`, mais sans
 * lecture de cookie : à l'envoi de l'email il n'y a pas de contexte requête
 * visiteur, la locale est déjà résolue en amont (`order.localeCode ??
 * store.defaultLocaleCode`) et passée explicitement en paramètre.
 *
 * Retourne un objet vide (comportement inchangé — littéraux en dur) si :
 * - le niveau `multilingual` de `platform.localization` n'est pas atteint ;
 * - le store n'a pas de locale par défaut ou moins de deux locales
 *   `ACTIVE` ;
 * - `localeCode` correspond à la locale par défaut (les littéraux en dur du
 *   template SONT la référence fr — un override reproduirait la même
 *   valeur) ;
 * - `localeCode` ne correspond à aucune locale `ACTIVE` connue.
 */
export async function resolveLocalizedOrderEmailCopy(input: {
  storeId: string;
  eventType: OrderEmailCopyEventType;
  localeCode: string;
}): Promise<OrderEmailCopyOverrides> {
  const { storeId, eventType, localeCode } = input;

  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual", { storeId });

  if (!allowed) {
    return EMPTY_OVERRIDES;
  }

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { defaultLocaleCode: true },
  });

  const locales = await db.localizationLocale.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    select: { id: true, code: true, isDefault: true },
  });

  if (locales.length < 2) {
    return EMPTY_OVERRIDES;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return EMPTY_OVERRIDES;
  }

  const visitorLocaleCode = resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode: localeCode,
  });

  if (visitorLocaleCode === defaultLocale.code) {
    return EMPTY_OVERRIDES;
  }

  const visitorLocale = locales.find((locale) => locale.code === visitorLocaleCode);

  if (visitorLocale === undefined) {
    return EMPTY_OVERRIDES;
  }

  const fields = getOrderEmailCopyFields(eventType);

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: ORDER_EMAIL_COPY_SUBJECT_TYPE,
      subjectId: eventType,
      fieldName: { in: fields.map((field) => field.fieldName) },
      status: "ACTIVE",
      archivedAt: null,
      localeId: { in: [visitorLocale.id, defaultLocale.id] },
    },
    select: { fieldName: true, localeId: true, valueText: true, status: true },
  });

  const candidatesByField = new Map<string, LocalizedValueCandidate[]>();

  for (const value of values) {
    const candidates = candidatesByField.get(value.fieldName);

    if (candidates === undefined) {
      candidatesByField.set(value.fieldName, [value]);
    } else {
      candidates.push(value);
    }
  }

  const overrides: Record<string, string> = {};

  for (const field of fields) {
    const resolved = resolveLocalizedValue({
      candidates: candidatesByField.get(field.fieldName) ?? [],
      requestedLocaleId: visitorLocale.id,
      defaultLocaleId: defaultLocale.id,
    });

    if (resolved !== null && !resolved.isFallback) {
      overrides[field.fieldName] = resolved.valueText;
    }
  }

  return overrides;
}
