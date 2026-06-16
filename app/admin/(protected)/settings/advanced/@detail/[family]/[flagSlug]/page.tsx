import { notFound } from "next/navigation";

import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { AdminSplitDetailSectionCard } from "@/components/admin/layout/admin-split-detail-section-card";
import {
  FeatureFlagDetail,
  FlagGovernancePanel,
} from "@/features/admin/pilotage/components/settings-advanced";
import { listAdminFeatureFlags } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import {
  FAMILY_SLUGS,
  findFlagBySlug,
  type FeatureFamilySlug,
} from "@/features/admin/pilotage/view-models/settings-advanced";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ family: string; flagSlug: string }>;
};

export default async function AdvancedSettingsDetailFlagPage({ params }: PageProps) {
  const { family, flagSlug } = await params;

  const validSlugs: readonly string[] = FAMILY_SLUGS;
  if (!validSlugs.includes(family)) {
    notFound();
  }

  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch {
    // Table non disponible
  }

  const flag = findFlagBySlug(flags, family as FeatureFamilySlug, flagSlug);

  if (flag === null) {
    notFound();
  }

  const governancePanel = await FlagGovernancePanel({ flagKey: flag.key });

  return (
    <AdminSplitDetailPaneShell>
      <AdminSplitDetailSectionCard className="overflow-hidden">
        <FeatureFlagDetail flag={flag} />
      </AdminSplitDetailSectionCard>
      {governancePanel !== null && (
        <AdminSplitDetailSectionCard>
          {governancePanel}
        </AdminSplitDetailSectionCard>
      )}
    </AdminSplitDetailPaneShell>
  );
}
