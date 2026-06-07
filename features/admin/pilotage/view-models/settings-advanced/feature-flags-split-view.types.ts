import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import type { FeatureFamily } from "@/features/admin/pilotage/catalog/feature-catalog.types";

export type { FeatureFamily };

export type FeatureFamilySlug =
  | "overview"
  | "core"
  | "cross_cutting"
  | "optional"
  | "satellite"
  | "unmapped";

export type FeatureFamilyNavItem = Readonly<{
  slug: FeatureFamilySlug;
  label: string;
  description: string;
  totalCount: number;
  activeCount: number;
  warningCount: number;
  href: string;
}>;

export type FeatureModuleGroup = Readonly<{
  module: string;
  label: string;
  flags: readonly AdminFeatureFlagView[];
}>;

export type FeatureFlagsOverviewStats = Readonly<{
  totalCatalogCount: number;
  dbCreatedCount: number;
  missingDbCount: number;
  unmappedCount: number;
  activeCount: number;
  inactiveCount: number;
  draftCount: number;
}>;

export type FeatureFamilyDetailViewModel = Readonly<{
  family: FeatureFamilySlug;
  label: string;
  description: string;
  totalCount: number;
  activeCount: number;
  moduleGroups: readonly FeatureModuleGroup[];
}>;
