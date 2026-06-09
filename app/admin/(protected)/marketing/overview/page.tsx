import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { MarketingOverviewSections } from "@/features/admin/marketing/components/marketing-overview-sections";

export default function AdminMarketingOverviewPage() {
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Marketing"
      contentPreset="overview"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <MarketingOverviewSections />
    </AdminPageShell>
  );
}
