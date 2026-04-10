import { PagesPageHeader, PagesPageShell } from "@/features/admin/pages";

type AdminContentPageDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminContentPageDetailPage({
  params,
}: AdminContentPageDetailPageProps) {
  const { id } = await params;

  return (
    <PagesPageShell>
      <PagesPageHeader
        title="Détail de page"
        description={`Édition de la page ${id}.`}
      />
      <div>Vue détail page à brancher.</div>
    </PagesPageShell>
  );
}
