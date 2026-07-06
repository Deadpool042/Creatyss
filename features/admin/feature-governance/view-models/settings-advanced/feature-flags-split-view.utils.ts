import type { AdminFeatureFlagView } from "@/features/admin/feature-governance/queries/list-admin-feature-flags.query";
import type {
  FeatureFamilySlug,
  FeatureFamilyNavItem,
  FeatureModuleGroup,
  FeatureFlagsOverviewStats,
  FeatureFamilyDetailViewModel,
} from "./feature-flags-split-view.types";

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

export const FAMILY_SLUGS: readonly FeatureFamilySlug[] = [
  "core",
  "cross_cutting",
  "optional",
  "satellite",
] as const;

export const FAMILY_LABELS: Record<FeatureFamilySlug, string> = {
  overview: "Vue d'ensemble",
  core: "Fonctionnalités fondamentales",
  cross_cutting: "Fonctionnalités transversales",
  optional: "Modules optionnels",
  satellite: "Modules satellites",
  unmapped: "Non catalogués",
};

export const FAMILY_DESCRIPTIONS: Record<FeatureFamilySlug, string> = {
  overview: "État global de la gouvernance des fonctionnalités.",
  core: "Fonctionnalités non désactivables, incluses par défaut.",
  cross_cutting: "Fonctionnalités transversales configurables.",
  optional: "Modules activables selon les besoins de la boutique.",
  satellite: "Modules conditionnels selon les prérequis.",
  unmapped: "Flags en base sans entrée dans le catalogue.",
};

// ---------------------------------------------------------------------------
// Helpers internes
// ---------------------------------------------------------------------------

function isEffectivelyActive(flag: AdminFeatureFlagView): boolean {
  return flag.dbState.isEffectivelyActive;
}

function hasActiveDbStatus(flag: AdminFeatureFlagView): boolean {
  return flag.dbState.status === "ACTIVE";
}

function isMissingDb(flag: AdminFeatureFlagView): boolean {
  return flag.dbState.exists === false;
}

function isUnmapped(flag: AdminFeatureFlagView): boolean {
  return flag.unmapped === true;
}

function flagsForFamily(
  flags: readonly AdminFeatureFlagView[],
  slug: FeatureFamilySlug
): readonly AdminFeatureFlagView[] {
  if (slug === "unmapped") {
    return flags.filter(isUnmapped);
  }
  return flags.filter((f) => f.family === slug && !isUnmapped(f));
}

function buildModuleGroups(
  flags: readonly AdminFeatureFlagView[]
): readonly FeatureModuleGroup[] {
  const byModule = new Map<string, AdminFeatureFlagView[]>();

  for (const flag of flags) {
    const mod = flag.module ?? "_unknown";
    const existing = byModule.get(mod);
    if (existing !== undefined) {
      existing.push(flag);
    } else {
      byModule.set(mod, [flag]);
    }
  }

  return Array.from(byModule.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mod, groupFlags]) => ({
      module: mod,
      label: mod,
      flags: groupFlags,
    }));
}

// ---------------------------------------------------------------------------
// Helpers slug par flag
// ---------------------------------------------------------------------------

/**
 * Dérive un slug URL depuis une clé de catalogue.
 * Convention : dernier segment de la clé (après le dernier `.`).
 * Exemples :
 *   "platform.localization" → "localization"
 *   "ai.core"               → "ai"
 *   "catalog.products.media"→ "media"
 */
export function flagSlugFromKey(key: string): string {
  const parts = key.split(".");
  return parts[parts.length - 1] ?? key;
}

/**
 * Résout un flag depuis son slug et sa famille.
 * En cas de collision (deux flags du même slug dans la même famille),
 * retourne le premier trouvé (cas non présent dans le catalogue actuel).
 */
export function findFlagBySlug(
  flags: readonly AdminFeatureFlagView[],
  family: FeatureFamilySlug,
  slug: string
): AdminFeatureFlagView | null {
  const familyFlags = flagsForFamily(flags, family);
  return familyFlags.find((f) => flagSlugFromKey(f.key) === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Helpers publics
// ---------------------------------------------------------------------------

export function buildFamilyNavItems(
  flags: readonly AdminFeatureFlagView[],
  rootPath: string,
  activeSlug?: FeatureFamilySlug
): readonly FeatureFamilyNavItem[] {
  const overviewPath = `${rootPath}/overview`;
  const unmappedFlags = flags.filter(isUnmapped);
  const unmappedCount = unmappedFlags.length;

  const overviewItem: FeatureFamilyNavItem = {
    slug: "overview",
    label: FAMILY_LABELS.overview,
    description: FAMILY_DESCRIPTIONS.overview,
    totalCount: flags.length,
    activeCount: flags.filter(isEffectivelyActive).length,
    warningCount:
      flags.filter(isMissingDb).length + unmappedCount,
    href: overviewPath,
  };

  const familyItems: readonly FeatureFamilyNavItem[] = FAMILY_SLUGS.map(
    (slug) => {
      const familyFlags = flagsForFamily(flags, slug);
      const missingInFamily = familyFlags.filter(isMissingDb).length;
      const isCurrentlyActive = slug === activeSlug;
      return {
        slug,
        label: FAMILY_LABELS[slug],
        description: FAMILY_DESCRIPTIONS[slug],
        totalCount: familyFlags.length,
        activeCount: familyFlags.filter(isEffectivelyActive).length,
        warningCount: missingInFamily,
        href: isCurrentlyActive ? overviewPath : `${rootPath}/${slug}`,
      };
    }
  );

  const result: FeatureFamilyNavItem[] = [overviewItem, ...familyItems];

  if (unmappedCount > 0) {
    const isUnmappedActive = activeSlug === "unmapped";
    result.push({
      slug: "unmapped",
      label: FAMILY_LABELS.unmapped,
      description: FAMILY_DESCRIPTIONS.unmapped,
      totalCount: unmappedCount,
      activeCount: unmappedFlags.filter(isEffectivelyActive).length,
      warningCount: unmappedCount,
      href: isUnmappedActive ? overviewPath : `${rootPath}/unmapped`,
    });
  }

  return result;
}

export function buildOverviewStats(
  flags: readonly AdminFeatureFlagView[]
): FeatureFlagsOverviewStats {
  const catalogFlags = flags.filter((f) => !isUnmapped(f));

  return {
    totalCatalogCount: catalogFlags.length,
    dbCreatedCount: flags.filter((f) => f.dbState.exists).length,
    missingDbCount: catalogFlags.filter(isMissingDb).length,
    unmappedCount: flags.filter(isUnmapped).length,
    activeCount: flags.filter(hasActiveDbStatus).length,
    inactiveCount: flags.filter(
      (f) => f.dbState.status === "INACTIVE"
    ).length,
    draftCount: flags.filter((f) => f.dbState.status === "DRAFT").length,
  };
}

export function buildFamilyDetailViewModel(
  flags: readonly AdminFeatureFlagView[],
  family: FeatureFamilySlug
): FeatureFamilyDetailViewModel | null {
  if (family === "overview") {
    return null;
  }

  const familyFlags = flagsForFamily(flags, family);

  if (familyFlags.length === 0) {
    return null;
  }

  return {
    family,
    label: FAMILY_LABELS[family],
    description: FAMILY_DESCRIPTIONS[family],
    totalCount: familyFlags.length,
    activeCount: familyFlags.filter(isEffectivelyActive).length,
    moduleGroups: buildModuleGroups(familyFlags),
  };
}
