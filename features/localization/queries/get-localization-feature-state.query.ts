import "server-only";

import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsRequiredLevel, resolveEffectiveLevel } from "@/entities/feature-flags/feature-level";
import { db } from "@/core/db";

/**
 * Premier guard gradué du repo (cf.
 * docs/lots/2026-06-12-localization-l1-cadrage.md, lot 1 ;
 * docs/domains/cross-cutting/feature-flags.md, « Gradation »).
 *
 * Résout l'état du flag `platform.localization` — actif/inactif et niveau
 * effectif parmi `allowedLevels` — en suivant le même schéma de résolution
 * que `queryFeatureFlagActive` (mono-store canonique, override STORE actif),
 * étendu à la gradation via `resolveEffectiveLevel`.
 */

export const LOCALIZATION_FEATURE_CODE = "platform.localization";

export type LocalizationFeatureState = Readonly<{
  isActive: boolean;
  allowedLevels: readonly string[];
  activeLevel: string | null;
}>;

const INACTIVE_STATE: LocalizationFeatureState = {
  isActive: false,
  allowedLevels: [],
  activeLevel: null,
};

type OverrideRow = {
  scopeType: string;
  scopeId: string;
  isEnabled: boolean;
  level: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  archivedAt: Date | null;
};

function isOverrideActive(override: OverrideRow, now: Date): boolean {
  if (override.archivedAt !== null) return false;
  if (override.startsAt !== null && override.startsAt > now) return false;
  if (override.endsAt !== null && override.endsAt < now) return false;
  return true;
}

export async function getLocalizationFeatureState(): Promise<LocalizationFeatureState> {
  const storeId = await getCurrentStoreId();

  const flags = await db.featureFlag.findMany({
    where: {
      code: LOCALIZATION_FEATURE_CODE,
      archivedAt: null,
      OR: [{ storeId }, { storeId: null }],
    },
    select: {
      status: true,
      isEnabledByDefault: true,
      allowedLevels: true,
      defaultLevel: true,
      storeId: true,
      overrides: {
        where: {
          archivedAt: null,
          ...(storeId !== null
            ? { scopeType: "STORE" as const, scopeId: storeId }
            : { scopeType: "STORE" as const, scopeId: "" }),
        },
        select: {
          scopeType: true,
          scopeId: true,
          isEnabled: true,
          level: true,
          startsAt: true,
          endsAt: true,
          archivedAt: true,
        },
      },
    },
  });

  if (flags.length === 0) {
    return INACTIVE_STATE;
  }

  const selectedFlag =
    (storeId !== null ? flags.find((f) => f.storeId === storeId) : null) ??
    flags.find((f) => f.storeId === null) ??
    null;

  if (selectedFlag === null) {
    return INACTIVE_STATE;
  }

  const now = new Date();
  const storeOverride =
    storeId !== null
      ? (selectedFlag.overrides.find(
          (o) => o.scopeType === "STORE" && o.scopeId === storeId && isOverrideActive(o, now)
        ) ?? null)
      : null;

  const isActive =
    storeOverride !== null
      ? storeOverride.isEnabled
      : selectedFlag.status === "ACTIVE" && selectedFlag.isEnabledByDefault;

  if (!isActive) {
    return { isActive: false, allowedLevels: selectedFlag.allowedLevels, activeLevel: null };
  }

  const activeLevel = resolveEffectiveLevel({
    allowedLevels: selectedFlag.allowedLevels,
    defaultLevel: selectedFlag.defaultLevel,
    overrideLevel: storeOverride?.level ?? null,
  });

  return { isActive: true, allowedLevels: selectedFlag.allowedLevels, activeLevel };
}

/**
 * Vrai si `localization` est active et que son niveau effectif autorise
 * `requiredLevel` (cf. `meetsRequiredLevel`).
 */
export async function meetsLocalizationLevel(requiredLevel: string): Promise<boolean> {
  const state = await getLocalizationFeatureState();

  if (!state.isActive) {
    return false;
  }

  return meetsRequiredLevel({
    allowedLevels: state.allowedLevels,
    activeLevel: state.activeLevel,
    requiredLevel,
  });
}
