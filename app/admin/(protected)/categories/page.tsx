import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { CategoryTable } from "@/features/admin/categories/components";
import { listAdminCategories } from "@/features/admin/categories/list/queries/list-admin-categories.query";
import { CategorieCreateTopbarMenu } from "@/features/admin/categories/components/create/categorie-create-topbar-menu";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return (
    <AdminPageShell
      headerVisibility="desktop"
      headerDensity="default"
      eyebrow="Catégories"
      title="Catégories"
      description="Structurez les collections visibles dans la boutique."
      hideDescriptionOnMobile
      topbarAction={<CategorieCreateTopbarMenu />}
      navigation={{ label: "Accueil", href: "/admin" }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Catégories", href: "/admin/categories" },
      ]}
      viewportClassName="!h-full"
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-14 pb-0 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 [@media(max-height:480px)]:pb-0 lg:h-full lg:!min-h-0 lg:px-6 lg:pb-4 lg:pt-0"
    >
      <CategoryTable categories={categories} />
    </AdminPageShell>
  );
}
