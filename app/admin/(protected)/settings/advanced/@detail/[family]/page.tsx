import { notFound } from "next/navigation";

import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { FeatureFlagsFamilyDetail } from "@/features/admin/pilotage/components/settings-advanced/feature-flags-family-detail";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import {
  buildFamilyDetailViewModel,
  FAMILY_SLUGS,
} from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.utils";
import type { FeatureFamilySlug } from "@/features/admin/pilotage/view-models/settings-advanced/feature-flags-split-view.types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ family: string }>;
};

export default async function AdvancedSettingsDetailFamilyPage({
  params,
}: PageProps) {
  const { family } = await params;

  const validSlugs: readonly string[] = FAMILY_SLUGS;
  if (!validSlugs.includes(family)) {
    notFound();
  }

  // "overview" n'est pas une famille, il n'a pas de detail de famille
  if (family === "overview") {
    notFound();
  }

  const validatedFamily = family as FeatureFamilySlug;

  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible
  }

  const viewModel = buildFamilyDetailViewModel(flags, validatedFamily);

  if (viewModel === null) {
    return (
      <AdminSplitDetailPaneShell contentClassName="items-center py-6">
          <p className="text-sm text-muted-foreground">
            Aucune fonctionnalité dans cette famille.
          </p>
      </AdminSplitDetailPaneShell>
    );
  }

  return (
    <div className="admin-split-detail-pane-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <FeatureFlagsFamilyDetail viewModel={viewModel} />
    </div>
  );
}
