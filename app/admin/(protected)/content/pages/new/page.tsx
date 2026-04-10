import { PagesPageHeader, PagesPageShell } from "@/features/admin/pages";

export default function AdminContentNewPagePage() {
  return (
    <PagesPageShell>
      <PagesPageHeader
        title="Nouvelle page"
        description="Créez une nouvelle page éditoriale."
      />
      <div>Formulaire de création de page à brancher.</div>
    </PagesPageShell>
  );
}
