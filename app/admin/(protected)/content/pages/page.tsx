import {
  PagesEmptyState,
  PagesList,
  PagesPageHeader,
  PagesPageShell,
  getAdminPagesList,
} from "@/features/admin/pages";

export const dynamic = "force-dynamic";

export default async function AdminContentPagesPage() {
  const pages = await getAdminPagesList();

  return (
    <PagesPageShell>
      <PagesPageHeader
        title="Pages"
        description="Pages éditoriales et pages système de la boutique."
      />
      {pages.length > 0 ? <PagesList pages={pages} /> : <PagesEmptyState />}
    </PagesPageShell>
  );
}
