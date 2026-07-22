import { notFound } from "next/navigation";

import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { AdminSplitDetailSectionCard } from "@/components/admin/layout/admin-split-detail-section-card";
import { FeatureFlagDetail } from "@/features/admin/feature-governance/components/settings-advanced";
import { loadFeatureFlagsSafe } from "@/features/admin/feature-governance/queries/load-feature-flags-safe.query";
import { findFlagBySlug } from "@/features/admin/feature-governance/view-models/settings-advanced";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ family: string }>;
};

export default async function AdvancedSettingsDetailLocalizationPage({ params }: PageProps) {
  const { family } = await params;

  if (family !== "optional") {
    notFound();
  }

  const flags = await loadFeatureFlagsSafe();

  const flag = findFlagBySlug(flags, "optional", "localization");

  if (flag === null) {
    notFound();
  }

  return (
    <AdminSplitDetailPaneShell>
      <AdminSplitDetailSectionCard className="overflow-hidden">
        <FeatureFlagDetail flag={flag} />
      </AdminSplitDetailSectionCard>
    </AdminSplitDetailPaneShell>
  );
}
