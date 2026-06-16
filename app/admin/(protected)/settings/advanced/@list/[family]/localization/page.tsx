import { notFound } from "next/navigation";

import { FeatureFlagsFamiliesList } from "@/features/admin/pilotage/components/settings-advanced/feature-flags-families-list";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { buildFamilyNavItems } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";

export const dynamic = "force-dynamic";

const ROOT_PATH = "/admin/settings/advanced";

type PageProps = {
  params: Promise<{ family: string }>;
};

export default async function AdvancedSettingsListLocalizationPage({ params }: PageProps) {
  const { family } = await params;

  if (family !== "optional") {
    notFound();
  }

  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible
  }

  const navItems = buildFamilyNavItems(flags, ROOT_PATH, "optional");

  return <FeatureFlagsFamiliesList items={navItems} activeSlug="optional" />;
}
