import { notFound } from "next/navigation";

import { FeatureFlagsFamiliesList } from "@/features/admin/feature-governance/components/settings-advanced/feature-flags-families-list";
import { loadFeatureFlagsSafe } from "@/features/admin/feature-governance/queries/load-feature-flags-safe.query";
import { buildFamilyNavItems } from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.utils";

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

  const flags = await loadFeatureFlagsSafe();

  const navItems = buildFamilyNavItems(flags, ROOT_PATH, "optional");

  return <FeatureFlagsFamiliesList items={navItems} activeSlug="optional" />;
}
