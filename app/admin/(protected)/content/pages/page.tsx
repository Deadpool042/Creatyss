import { PagesEmptyState, PagesPageHeader, PagesPageShell } from "@/features/admin/pages";

export default function AdminContentPagesPage() {
  return (
    <PagesPageShell>
      <PagesPageHeader
        title="Pages"
        description="Gérez les pages éditoriales génériques de la boutique."
      />
      <PagesEmptyState />
    </PagesPageShell>
  );
}
