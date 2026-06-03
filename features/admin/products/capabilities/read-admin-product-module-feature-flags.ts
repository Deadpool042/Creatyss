import "server-only";

import type {
  FeatureFlagScopeType,
  FeatureFlagStatus,
  PrismaClient,
} from "@/prisma-generated/client";

import { adminProductModuleFeatureFlags } from "./product-module-policy";

type ReadAdminProductModuleFeatureFlagsInput = {
  db: PrismaClient;
  storeId: string;
  userId: string;
};

export type AdminProductModuleFeatureFlagsState = Partial<
  Record<keyof typeof adminProductModuleFeatureFlags, boolean>
>;

type FeatureFlagRow = {
  code: string;
  status: FeatureFlagStatus;
  isEnabledByDefault: boolean;
  storeId: string | null;
  scopeType: FeatureFlagScopeType;
  overrides: Array<{
    scopeType: FeatureFlagScopeType;
    scopeId: string;
    isEnabled: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    archivedAt: Date | null;
  }>;
};

function isFlagActive(flag: Pick<FeatureFlagRow, "status" | "isEnabledByDefault">): boolean {
  return flag.status === "ACTIVE" && flag.isEnabledByDefault;
}

function isOverrideActive(
  override: Pick<FeatureFlagRow["overrides"][number], "startsAt" | "endsAt" | "archivedAt">,
  now: Date,
): boolean {
  if (override.archivedAt !== null) {
    return false;
  }

  if (override.startsAt !== null && override.startsAt > now) {
    return false;
  }

  if (override.endsAt !== null && override.endsAt < now) {
    return false;
  }

  return true;
}

function resolveFlagState(
  flags: readonly FeatureFlagRow[],
  input: { storeId: string; userId: string },
): boolean | undefined {
  if (flags.length === 0) {
    return undefined;
  }

  const now = new Date();
  const selectedFlag =
    flags.find((flag) => flag.storeId === input.storeId) ??
    flags.find((flag) => flag.storeId === null) ??
    null;

  if (selectedFlag === null) {
    return undefined;
  }

  const userOverride = selectedFlag.overrides.find(
    (override) =>
      override.scopeType === "USER" &&
      override.scopeId === input.userId &&
      isOverrideActive(override, now),
  );

  if (userOverride) {
    return userOverride.isEnabled;
  }

  const storeOverride = selectedFlag.overrides.find(
    (override) =>
      override.scopeType === "STORE" &&
      override.scopeId === input.storeId &&
      isOverrideActive(override, now),
  );

  if (storeOverride) {
    return storeOverride.isEnabled;
  }

  return isFlagActive(selectedFlag);
}

export async function readAdminProductModuleFeatureFlags(
  input: ReadAdminProductModuleFeatureFlagsInput,
): Promise<AdminProductModuleFeatureFlagsState> {
  const featureFlags = await input.db.featureFlag.findMany({
    where: {
      archivedAt: null,
      code: {
        in: Object.values(adminProductModuleFeatureFlags),
      },
      OR: [
        {
          storeId: input.storeId,
        },
        {
          storeId: null,
        },
      ],
    },
    select: {
      code: true,
      status: true,
      isEnabledByDefault: true,
      storeId: true,
      scopeType: true,
      overrides: {
        where: {
          archivedAt: null,
          OR: [
            {
              scopeType: "STORE",
              scopeId: input.storeId,
            },
            {
              scopeType: "USER",
              scopeId: input.userId,
            },
          ],
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

  const entries = Object.entries(adminProductModuleFeatureFlags).map(([moduleKey, code]) => {
    const matchingFlags = featureFlags.filter((flag) => flag.code === code);

    return [
      moduleKey,
      resolveFlagState(matchingFlags, {
        storeId: input.storeId,
        userId: input.userId,
      }),
    ] as const;
  });

  return Object.fromEntries(
    entries.filter((entry): entry is readonly [string, boolean] => typeof entry[1] === "boolean"),
  ) as AdminProductModuleFeatureFlagsState;
}
