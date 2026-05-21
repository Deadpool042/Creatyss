import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { FullWidthPageFrame, FullWidthStack } from "@/components/shared/layout";
import { CatalogOverviewSections } from "@/features/admin/catalog/components/catalog-overview-sections";
import { getCatalogOverviewStats } from "@/features/admin/catalog/queries/get-catalog-overview-stats.query";

export default async function CatalogOverviewPage() {
  const stats = await getCatalogOverviewStats();

  return (
    <AdminPageShell
      headerVisibility="desktop"
      scrollMode="area"
      viewportClassName="!h-full"
      title="Vue d'ensemble du catalogue"
      eyebrow="Catalogue"
      description="KPIs produits, catégories et médias. Points d'attention et accès rapides."
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          <CatalogOverviewSections stats={stats} />
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
