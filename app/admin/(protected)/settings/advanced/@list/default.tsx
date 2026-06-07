import { FeatureFlagsFamiliesList } from "@/features/admin/pilotage/components/settings-advanced/feature-flags-families-list";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { buildFamilyNavItems } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";

export const dynamic = "force-dynamic";

const ROOT_PATH = "/admin/settings/advanced";

export default async function AdvancedSettingsListDefaultSlot() {
  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible
  }

  const navItems = buildFamilyNavItems(flags, ROOT_PATH);

  return <FeatureFlagsFamiliesList items={navItems} activeSlug="overview" />;
}
