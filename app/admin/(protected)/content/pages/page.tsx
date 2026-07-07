import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";
import { PagesList, getAdminPagesList } from "@/features/admin/pages";

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
      {pages.length > 0 ? (
        <PagesList pages={pages} />
      ) : (
        <AdminEmptyState
          eyebrow="Aucune page"
          title="Aucune page pour le moment"
          description="Les pages de la boutique apparaîtront ici, y compris les pages légales système une fois leurs textes enregistrés dans les réglages."
        />
      )}
    </AdminPageShell>
  );
}
