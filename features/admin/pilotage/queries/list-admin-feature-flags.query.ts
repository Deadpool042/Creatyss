import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { resolveEffectiveLevel } from "@/entities/feature-flags/feature-level";
import {
  getFeatureCatalogEntries,
  findFeatureCatalogEntry,
} from "../catalog";
import type {
  FeatureFamily,
  FeatureMutability,
  FeatureScope,
  FeatureLevelKey,
} from "../catalog/feature-catalog.types";
import { isOverrideActive } from "@/features/feature-flags/queries/get-feature-level-state.query";

/** @deprecated Utiliser AdminFeatureFlagView */
export type AdminFeatureFlagSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  scopeType: "GLOBAL" | "STORE" | "USER";
  isEnabledByDefault: boolean;
  overridesCount: number;
  updatedAt: string;
};

export type AdminFeatureFlagView = Readonly<{
  /** Clé catalogue TS (= code DB) */
  key: string;
  /** Label catalogue ou fallback = key pour les entrées unmapped */
  label: string;
  description: string;
  family: FeatureFamily | null;
  module: string | null;
  capability?: string;
  mutability: FeatureMutability | null;
  scopes: readonly FeatureScope[];
  levels?: readonly FeatureLevelKey[];

  dbState: Readonly<{
    exists: boolean;
    /** id Prisma — null si pas de row DB */
    id: string | null;
    status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED" | null;
    isEnabledByDefault: boolean | null;
    scopeType: "GLOBAL" | "STORE" | "USER" | null;
    overridesCount: number;
    updatedAt: string | null;
    /** Niveaux autorisés en base (FeatureFlag.allowedLevels) — [] si non graduée */
    allowedLevels: readonly string[];
    /** Niveau effectif résolu (override actif sinon defaultLevel) — null si non graduée ou inactive */
    effectiveLevel: string | null;
  }>;

  /** true si un FeatureFlag DB existe pour cette clé mais absente du catalogue TS */
  unmapped?: true;
}>;

export async function listAdminFeatureFlags(): Promise<readonly AdminFeatureFlagView[]> {
  const storeId = await getCurrentStoreId();

  const rows = await db.featureFlag.findMany({
    where: { archivedAt: null },
    orderBy: [{ status: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      status: true,
      scopeType: true,
      isEnabledByDefault: true,
      allowedLevels: true,
      defaultLevel: true,
      updatedAt: true,
      _count: { select: { overrides: true } },
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

  const dbByCode = new Map(rows.map((r) => [r.code, r]));
  const catalogEntries = getFeatureCatalogEntries();

  const now = new Date();

  function effectiveLevelFor(row: (typeof rows)[number]): string | null {
    const storeOverride =
      storeId !== null
        ? (row.overrides.find(
            (o) => o.scopeType === "STORE" && o.scopeId === storeId && isOverrideActive(o, now)
          ) ?? null)
        : null;

    const isActive =
      storeOverride !== null
        ? storeOverride.isEnabled
        : row.status === "ACTIVE" && row.isEnabledByDefault;

    if (!isActive) {
      return null;
    }

    return resolveEffectiveLevel({
      allowedLevels: row.allowedLevels,
      defaultLevel: row.defaultLevel,
      overrideLevel: storeOverride?.level ?? null,
    });
  }

  const views: AdminFeatureFlagView[] = [];

  // 1. Toutes les entrées catalogue — avec ou sans row DB
  for (const entry of catalogEntries) {
    const row = dbByCode.get(entry.key) ?? null;
    views.push({
      key: entry.key,
      label: entry.label,
      description: entry.description,
      family: entry.family,
      module: entry.module,
      ...(entry.capability !== undefined ? { capability: entry.capability } : {}),
      mutability: entry.mutability,
      scopes: entry.scopes,
      ...(entry.levels !== undefined ? { levels: entry.levels } : {}),
      dbState: {
        exists: row !== null,
        id: row?.id ?? null,
        status: row
          ? (row.status as AdminFeatureFlagView["dbState"]["status"])
          : null,
        isEnabledByDefault: row?.isEnabledByDefault ?? null,
        scopeType: row
          ? (row.scopeType as AdminFeatureFlagView["dbState"]["scopeType"])
          : null,
        overridesCount: row?._count.overrides ?? 0,
        updatedAt: row?.updatedAt.toISOString() ?? null,
        allowedLevels: row?.allowedLevels ?? [],
        effectiveLevel: row ? effectiveLevelFor(row) : null,
      },
    });
  }

  // 2. Flags DB sans entrée catalogue (unmapped)
  for (const row of rows) {
    if (findFeatureCatalogEntry(row.code) !== null) continue;
    views.push({
      key: row.code,
      label: row.name,
      description: row.description ?? "",
      family: null,
      module: null,
      mutability: null,
      scopes: [],
      dbState: {
        exists: true,
        id: row.id,
        status: row.status as AdminFeatureFlagView["dbState"]["status"],
        isEnabledByDefault: row.isEnabledByDefault,
        scopeType: row.scopeType as AdminFeatureFlagView["dbState"]["scopeType"],
        overridesCount: row._count.overrides,
        updatedAt: row.updatedAt.toISOString(),
        allowedLevels: row.allowedLevels,
        effectiveLevel: effectiveLevelFor(row),
      },
      unmapped: true,
    });
  }

  return views;
}
