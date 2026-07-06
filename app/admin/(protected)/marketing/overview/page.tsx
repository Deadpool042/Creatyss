import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { MarketingOverviewSections } from "@/features/admin/marketing/components/marketing-overview-sections";
import { MarketingRouteNav } from "@/features/admin/marketing/components/marketing-route-nav";

export default function AdminMarketingOverviewPage() {
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Marketing"
      contentPreset="overview"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing" }]}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          title="Marketing"
          description="Vue d'ensemble des remises, automatisations et campagnes newsletter."
        />
      }
    >
      <MarketingRouteNav />
      <MarketingOverviewSections />
    </AdminPageShell>
  );
}
