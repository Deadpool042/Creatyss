import { notFound } from "next/navigation";

import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { AdminSplitDetailSectionCard } from "@/components/admin/layout/admin-split-detail-section-card";
import {
  FeatureFlagDetail,
  FlagGovernancePanel,
} from "@/features/admin/feature-governance/components/settings-advanced";
import { loadFeatureFlagsSafe } from "@/features/admin/feature-governance/queries/load-feature-flags-safe.query";
import {
  FAMILY_SLUGS,
  findFlagBySlug,
  type FeatureFamilySlug,
} from "@/features/admin/feature-governance/view-models/settings-advanced";

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

  const flags = await loadFeatureFlagsSafe();

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
        <AdminSplitDetailSectionCard>{governancePanel}</AdminSplitDetailSectionCard>
      )}
    </AdminSplitDetailPaneShell>
  );
}
