import { FeatureFlagsOverview } from "@/features/admin/pilotage/components/settings-advanced/feature-flags-overview";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { buildOverviewStats } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";

export const dynamic = "force-dynamic";

export default async function AdvancedSettingsDetailOverviewPage() {
  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch (error) {
    console.error("[settings/advanced] listAdminFeatureFlags failed", error);
  }

  const stats = buildOverviewStats(flags);

  return <FeatureFlagsOverview stats={stats} />;
}
