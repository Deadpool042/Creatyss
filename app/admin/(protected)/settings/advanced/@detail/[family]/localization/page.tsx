import { notFound } from "next/navigation";

import { AdminSplitDetailPaneShell } from "@/components/admin/layout/admin-split-detail-pane-shell";
import { AdminSplitDetailSectionCard } from "@/components/admin/layout/admin-split-detail-section-card";
import { FeatureFlagDetail } from "@/features/admin/feature-governance/components/settings-advanced";
import { listAdminFeatureFlags } from "@/features/admin/feature-governance/queries/list-admin-feature-flags.query";
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

  let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;

  try {
    flags = await listAdminFeatureFlags();
  } catch (error) {
    console.error("[settings/advanced] listAdminFeatureFlags failed", error);
  }

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
