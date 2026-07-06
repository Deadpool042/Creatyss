import { listAdminFeatureFlags } from "@/features/admin/feature-governance/queries/list-admin-feature-flags.query";
import { buildOverviewStats } from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.utils";
import { FeatureFlagsOverview } from "@/features/admin/feature-governance/components/settings-advanced/feature-flags-overview";

export const dynamic = "force-dynamic";

export default async function AdvancedSettingsDetailDefaultSlot() {
  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch (error) {
    console.error("[settings/advanced] listAdminFeatureFlags failed", error);
  }

  const stats = buildOverviewStats(flags);

  return <FeatureFlagsOverview stats={stats} />;
}
