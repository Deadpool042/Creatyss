import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";
import { PagesEmptyState, PagesList, getAdminPagesList } from "@/features/admin/pages";

export const dynamic = "force-dynamic";

export default async function AdminContentPagesPage() {
  const pages = await getAdminPagesList();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Pages"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu", href: "/admin/content/overview" },
        { label: "Pages" },
      ]}
      contentPreset="table"
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Contenu"
          title="Pages"
          description="Pages éditoriales et pages système de la boutique."
        />
      }
    >
      <ContentRouteNav />
      {pages.length > 0 ? <PagesList pages={pages} /> : <PagesEmptyState />}
    </AdminPageShell>
  );
}
