import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { buildOverviewStats } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";
import { FeatureFlagsOverview } from "@/features/admin/pilotage/components/settings-advanced/feature-flags-overview";

export const dynamic = "force-dynamic";

export default async function AdvancedSettingsDetailDefaultSlot() {
  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible
  }

  const stats = buildOverviewStats(flags);

  return <FeatureFlagsOverview stats={stats} />;
}
