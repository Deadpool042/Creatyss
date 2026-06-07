import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AnalyticsOverviewSections } from "@/features/admin/insights/components/analytics-overview-sections";
import { isAnalyticsFeatureActive } from "@/features/admin/insights/queries/is-analytics-feature-active.query";

export default async function AdminInsightsAnalyticsPage() {
  const featureActive = await isAnalyticsFeatureActive();
  if (!featureActive) notFound();

  return (
    <AdminPageShell
      scrollMode="area"
      title="Analytics"
      contentPreset="overview"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Insights" }, { label: "Analytics" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AnalyticsOverviewSections />
    </AdminPageShell>
  );
}
