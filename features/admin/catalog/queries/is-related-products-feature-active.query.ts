import "server-only";

import { db } from "@/core/db";

const RELATED_PRODUCTS_FEATURE_FLAG_CODE = "catalog.products.related";

function isOverrideActive(override: {
  startsAt: Date | null;
  endsAt: Date | null;
  archivedAt: Date | null;
}): boolean {
  if (override.archivedAt !== null) return false;
  const now = new Date();
  if (override.startsAt !== null && override.startsAt > now) return false;
  if (override.endsAt !== null && override.endsAt < now) return false;
  return true;
}

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

export async function isRelatedProductsFeatureActive(): Promise<boolean> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  const storeId = store?.id ?? null;

  const flags: FlagRow[] = await db.featureFlag.findMany({
    where: {
      code: RELATED_PRODUCTS_FEATURE_FLAG_CODE,
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

  if (flags.length === 0) {
    return false;
  }

  // Prefer store-specific flag over global flag
  const selectedFlag =
    (storeId !== null ? flags.find((f) => f.storeId === storeId) : null) ??
    flags.find((f) => f.storeId === null) ??
    null;

  if (selectedFlag === null) {
    return false;
  }

  // Resolve STORE override if present and storeId is known
  if (storeId !== null) {
    const storeOverride = selectedFlag.overrides.find(
      (o) =>
        o.scopeType === "STORE" &&
        o.scopeId === storeId &&
        isOverrideActive(o),
    );

    if (storeOverride !== undefined) {
      return storeOverride.isEnabled;
    }
  }

  return selectedFlag.status === "ACTIVE" && selectedFlag.isEnabledByDefault;
}
