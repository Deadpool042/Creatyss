import { db } from "@/core/db";
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
  }>;

  /** true si un FeatureFlag DB existe pour cette clé mais absente du catalogue TS */
  unmapped?: true;
}>;

export async function listAdminFeatureFlags(): Promise<readonly AdminFeatureFlagView[]> {
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
      updatedAt: true,
      _count: { select: { overrides: true } },
    },
  });

  const dbByCode = new Map(rows.map((r) => [r.code, r]));
  const catalogEntries = getFeatureCatalogEntries();

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
      },
      unmapped: true,
    });
  }

  return views;
}
