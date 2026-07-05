import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ContentOverviewSections } from "@/features/admin/content/components/content-overview-sections";
import { getContentOverviewStats } from "@/features/admin/content/queries/get-content-overview-stats.query";

export default async function AdminContentOverviewPage() {
  const stats = await getContentOverviewStats();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Vue d'ensemble contenu"
      contentPreset="overview"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu" },
      ]}
      showTitleInContent={false}
    >
      <ContentOverviewSections stats={stats} />
    </AdminPageShell>
  );
}
