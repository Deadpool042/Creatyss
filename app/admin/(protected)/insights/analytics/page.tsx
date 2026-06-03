import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AnalyticsOverviewSections } from "@/features/admin/insights/components/analytics-overview-sections";

export default function AdminInsightsAnalyticsPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Analytics"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Insights" }, { label: "Analytics" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AnalyticsOverviewSections />
    </AdminPageShell>
  );
}
