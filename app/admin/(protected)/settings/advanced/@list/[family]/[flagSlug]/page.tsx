import { notFound } from "next/navigation";

import { FeatureFlagsFamiliesList } from "@/features/admin/pilotage/components/settings-advanced/feature-flags-families-list";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import {
  buildFamilyNavItems,
  FAMILY_SLUGS,
} from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";
import type { FeatureFamilySlug } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.types";

export const dynamic = "force-dynamic";

const ROOT_PATH = "/admin/settings/advanced";

type PageProps = {
  params: Promise<{ family: string; flagSlug: string }>;
};

/**
 * Slot @list pour une URL de détail de flag (/[family]/[flagSlug]).
 * La liste de familles reste visible avec la famille parente sélectionnée.
 */
export default async function AdvancedSettingsListFlagSlugPage({ params }: PageProps) {
  const { family } = await params;

  const validSlugs: readonly string[] = FAMILY_SLUGS;
  if (!validSlugs.includes(family)) {
    notFound();
  }

  const validatedFamily = family as FeatureFamilySlug;

  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch (error) {
    console.error("[settings/advanced] listAdminFeatureFlags failed", error);
  }

  const navItems = buildFamilyNavItems(flags, ROOT_PATH, validatedFamily);

  return <FeatureFlagsFamiliesList items={navItems} activeSlug={validatedFamily} />;
}
