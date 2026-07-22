import { notFound } from "next/navigation";

import { FeatureFlagsFamiliesList } from "@/features/admin/feature-governance/components/settings-advanced/feature-flags-families-list";
import { loadFeatureFlagsSafe } from "@/features/admin/feature-governance/queries/load-feature-flags-safe.query";
import {
  buildFamilyNavItems,
  FAMILY_SLUGS,
} from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.utils";
import type { FeatureFamilySlug } from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.types";

export const dynamic = "force-dynamic";

const ROOT_PATH = "/admin/settings/advanced";

type PageProps = {
  params: Promise<{ family: string }>;
};

export default async function AdvancedSettingsListFamilyPage({ params }: PageProps) {
  const { family } = await params;

  const validSlugs: readonly string[] = FAMILY_SLUGS;
  if (!validSlugs.includes(family)) {
    notFound();
  }

  const validatedFamily = family as FeatureFamilySlug;

  const flags = await loadFeatureFlagsSafe();

  const navItems = buildFamilyNavItems(flags, ROOT_PATH, validatedFamily);

  return <FeatureFlagsFamiliesList items={navItems} activeSlug={validatedFamily} />;
}
