import { loadFeatureFlagsSafe } from "@/features/admin/feature-governance/queries/load-feature-flags-safe.query";
import { buildOverviewStats } from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.utils";
import { FeatureFlagsOverview } from "@/features/admin/feature-governance/components/settings-advanced/feature-flags-overview";

export const dynamic = "force-dynamic";

export default async function AdvancedSettingsDetailDefaultSlot() {
  const flags = await loadFeatureFlagsSafe();

  const stats = buildOverviewStats(flags);

  return <FeatureFlagsOverview stats={stats} />;
}
