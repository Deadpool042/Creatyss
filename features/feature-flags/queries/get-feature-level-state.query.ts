import "server-only";

import { db } from "@/core/db";
import { meetsRequiredLevel, resolveEffectiveLevel } from "@/entities/feature-flags/feature-level";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

/**
 * Résolveur générique de niveau pour les features `FeatureFlag` graduées
 * (cf. `docs/domains/cross-cutting/feature-governance.md`, « Niveaux
 * fonctionnels gradués »).
 *
 * Le runtime de résolution vit dans le domaine transverse `feature-flags` :
 * il peut être consommé par l'admin, le storefront ou les routes API sans
 * dépendre de `features/admin/pilotage`.
 *
 * Même schéma de résolution que `queryFeatureFlagActive` : mono-store
 * canonique, override `STORE` actif prioritaire sur le défaut.
 */

export type FeatureLevelState = Readonly<{
  isActive: boolean;
  allowedLevels: readonly string[];
  activeLevel: string | null;
}>;

type FeatureLevelStateOptions = {
  storeId?: string | null;
};

const INACTIVE_STATE: FeatureLevelState = {
  isActive: false,
  allowedLevels: [],
  activeLevel: null,
};

export type OverrideRow = {
  scopeType: string;
  scopeId: string;
  isEnabled: boolean;
  level?: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  archivedAt: Date | null;
};

export function isOverrideActive(override: OverrideRow, now: Date): boolean {
  if (override.archivedAt !== null) return false;
  if (override.startsAt !== null && override.startsAt > now) return false;
  if (override.endsAt !== null && override.endsAt < now) return false;
  return true;
}

/**
 * Résout l'état d'une feature graduée — actif/inactif et niveau effectif
 * parmi `allowedLevels` — pour le `FeatureFlag` identifié par `code`.
 */
export async function getFeatureLevelState(
  code: string,
  options?: FeatureLevelStateOptions
): Promise<FeatureLevelState> {
  const storeId =
    options && "storeId" in options ? (options.storeId ?? null) : await getCurrentStoreId();

  const flags = await db.featureFlag.findMany({
    where: {
      code,
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
 * Vrai si la feature `code` est active et que son niveau effectif autorise
 * `requiredLevel` (cf. `meetsRequiredLevel`).
 */
export async function meetsFeatureLevel(
  code: string,
  requiredLevel: string,
  options?: FeatureLevelStateOptions
): Promise<boolean> {
  const state = await getFeatureLevelState(code, options);

  if (!state.isActive) {
    return false;
  }

  return meetsRequiredLevel({
    allowedLevels: state.allowedLevels,
    activeLevel: state.activeLevel,
    requiredLevel,
  });
}
