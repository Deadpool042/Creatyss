import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  resolveLocalizedValue,
  type ResolvedLocalizedValue,
} from "@/entities/localization/resolve-localized-value";

export type GetLocalizedValueInput = {
  subjectType: string;
  subjectId: string;
  fieldName: string;
  /** Code de la locale demandée. Absent ou inconnu → résolution pour la locale par défaut. */
  localeCode?: string | null;
};

/**
 * Résout la valeur localisée ACTIVE pour (subjectType, subjectId, fieldName)
 * dans la locale demandée, avec fallback vers la locale par défaut du store
 * (lot 4 sous-lot 2, cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Retourne `null` si le store n'a pas de locale par défaut gérée, ou si
 * aucune valeur ACTIVE n'existe ni pour la locale demandée ni pour la
 * locale par défaut — l'appelant retombe alors sur la valeur source du
 * domaine concerné (hors périmètre de `localization`).
 *
 * Non branché sur un écran à ce stade (mécanisme seul, lot 4 sous-lot 2).
 */
export async function getLocalizedValue(
  input: GetLocalizedValueInput
): Promise<ResolvedLocalizedValue | null> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return null;
  }

  const locales = await db.localizationLocale.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    select: { id: true, code: true, isDefault: true },
  });

  const defaultLocale = locales.find((locale) => locale.isDefault) ?? null;

  if (defaultLocale === null) {
    return null;
  }

  const requestedLocale =
    (input.localeCode != null
      ? locales.find((locale) => locale.code === input.localeCode)
      : undefined) ?? defaultLocale;

  const values = await db.localizedValue.findMany({
    where: {
      storeId,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      fieldName: input.fieldName,
      status: "ACTIVE",
      archivedAt: null,
      localeId: { in: [requestedLocale.id, defaultLocale.id] },
    },
    select: { localeId: true, valueText: true, status: true },
  });

  return resolveLocalizedValue({
    candidates: values,
    requestedLocaleId: requestedLocale.id,
    defaultLocaleId: defaultLocale.id,
  });
}
