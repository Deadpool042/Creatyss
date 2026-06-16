import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { isOverrideActive } from "./get-feature-level-state.query";

type FlagRow = {
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  isEnabledByDefault: boolean;
  storeId: string | null;
  overrides: Array<{
    scopeType: string;
    scopeId: string;
    isEnabled: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    archivedAt: Date | null;
  }>;
};

type QueryFeatureFlagActiveOptions = {
  storeId?: string | null;
};

/**
 * Résout l'état actif d'un feature flag pour le premier store
 * (mono-store canonique). Prend en compte les overrides STORE actifs.
 * Les overrides USER sont ignorés.
 */
export async function queryFeatureFlagActive(
  code: string,
  options?: QueryFeatureFlagActiveOptions
): Promise<boolean> {
  const storeId =
    options && "storeId" in options ? (options.storeId ?? null) : await getCurrentStoreId();

  const flags: FlagRow[] = await db.featureFlag.findMany({
    where: {
      code,
      archivedAt: null,
      OR: [{ storeId }, { storeId: null }],
    },
    select: {
      status: true,
      isEnabledByDefault: true,
      storeId: true,
      overrides: {
        where: {
          archivedAt: null,
          ...(storeId !== null
            ? { scopeType: "STORE", scopeId: storeId }
            : { scopeType: "STORE", scopeId: "" }),
        },
        select: {
          scopeType: true,
          scopeId: true,
          isEnabled: true,
          startsAt: true,
          endsAt: true,
          archivedAt: true,
        },
      },
    },
  });

  if (flags.length === 0) return false;

  const selectedFlag =
    (storeId !== null ? flags.find((f) => f.storeId === storeId) : null) ??
    flags.find((f) => f.storeId === null) ??
    null;

  if (selectedFlag === null) return false;

  if (storeId !== null) {
    const now = new Date();
    const storeOverride = selectedFlag.overrides.find(
      (o) => o.scopeType === "STORE" && o.scopeId === storeId && isOverrideActive(o, now)
    );

    if (storeOverride !== undefined) return storeOverride.isEnabled;
  }

  return selectedFlag.status === "ACTIVE" && selectedFlag.isEnabledByDefault;
}
