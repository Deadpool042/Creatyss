import { describe, expect, it } from "vitest";

import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import {
  buildFamilyDetailViewModel,
  buildFamilyNavItems,
  buildOverviewStats,
} from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";

function createFlag(
  input: Readonly<{
    key: string;
    family: NonNullable<AdminFeatureFlagView["family"]>;
    status: NonNullable<AdminFeatureFlagView["dbState"]["status"]>;
    isEffectivelyActive: boolean;
  }>
): AdminFeatureFlagView {
  return {
    key: input.key,
    label: input.key,
    description: "",
    family: input.family,
    module: "test",
    mutability: "toggleable",
    scopes: ["store"],
    dbState: {
      exists: true,
      id: `id-${input.key}`,
      status: input.status,
      isEnabledByDefault: input.status === "ACTIVE",
      scopeType: "STORE",
      overridesCount: 0,
      updatedAt: "2026-06-18T00:00:00.000Z",
      allowedLevels: [],
      isEffectivelyActive: input.isEffectivelyActive,
      effectiveLevel: null,
    },
  };
}

describe("feature flags split view", () => {
  const flags = [
    createFlag({
      key: "optional.active-by-override",
      family: "optional",
      status: "INACTIVE",
      isEffectivelyActive: true,
    }),
    createFlag({
      key: "optional.disabled-by-override",
      family: "optional",
      status: "ACTIVE",
      isEffectivelyActive: false,
    }),
    createFlag({
      key: "core.active",
      family: "core",
      status: "ACTIVE",
      isEffectivelyActive: true,
    }),
  ] satisfies readonly AdminFeatureFlagView[];

  it("compte l'état effectif dans la navigation", () => {
    const items = buildFamilyNavItems(flags, "/admin/settings/advanced");
    const overview = items.find((item) => item.slug === "overview");
    const optional = items.find((item) => item.slug === "optional");

    expect(overview?.activeCount).toBe(2);
    expect(optional?.activeCount).toBe(1);
    expect(optional?.totalCount).toBe(2);
  });

  it("compte l'état effectif dans le détail d'une famille", () => {
    const detail = buildFamilyDetailViewModel(flags, "optional");

    expect(detail?.activeCount).toBe(1);
    expect(detail?.totalCount).toBe(2);
  });

  it("conserve les statuts DB dans les statistiques globales", () => {
    const stats = buildOverviewStats(flags);

    expect(stats.activeCount).toBe(2);
    expect(stats.inactiveCount).toBe(1);
    expect(stats.draftCount).toBe(0);
  });
});
