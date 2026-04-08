import Link from "next/link";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminCollectionSection } from "@/components/admin/admin-collection-section";
import { AdminCategoryCard } from "@/components/admin/admin-category-card";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/notice";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { listAdminCategories } from "@/features/admin/categories/list/queries/list-admin-categories.query";

export const dynamic = "force-dynamic";

type AdminCategoriesPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Catégorie créée avec succès.";
    case "updated":
      return "Catégorie mise à jour avec succès.";
    case "deleted":
      return "Catégorie supprimée avec succès.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_category":
      return "La catégorie demandée est introuvable.";
    default:
      return null;
  }
}

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const categories = await listAdminCategories();

  return (
    <AdminPageShell
      mode="viewport"
      variant="tool"
      compactMobileTitle
      eyebrow="Catégories"
      title="Catégories"
      description="Organisez le catalogue avec des catégories simples et réutilisables."
      pageTitleAction={{ label: "Nouvelle catégorie", href: "/admin/categories/new" }}
      actions={
        <Button asChild size="sm" className="w-full sm:min-w-40 sm:w-auto">
          <Link href="/admin/categories/new">Nouvelle catégorie</Link>
        </Button>
      }
      scrollMode="nested"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-6 [@media(max-height:480px)]:gap-3">
        {successMessage ? (
          <div className="shrink-0">
            <Notice tone="success">{successMessage}</Notice>
          </div>
        ) : null}
        {errorMessage ? (
          <div className="shrink-0">
            <Notice tone="alert">{errorMessage}</Notice>
          </div>
        ) : null}

        <AdminCollectionSection
          className="min-h-0 flex-1"
          contentClassName="min-h-0 flex-1 overflow-y-auto pr-1"
          description="Les cartes ci-dessous reflètent l'état actuel du catalogue, trié par nom."
          eyebrow="Catalogue"
          title="Catégories du catalogue"
          variant="plain"
          meta={
            categories.length > 0 ? (
              <span className="inline-flex h-7 items-center rounded-full border border-border-soft bg-surface-panel-soft px-3 text-xs font-medium text-foreground">
                {categories.length} catégor{categories.length > 1 ? "ies" : "ie"}
              </span>
            ) : null
          }
        >
          {categories.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
              {categories.map((category) => (
                <AdminCategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <AdminEmptyState
              description="Créez une première catégorie pour structurer le catalogue."
              eyebrow="Aucune catégorie"
              title="Le catalogue ne contient pas encore de catégorie"
            />
          )}
        </AdminCollectionSection>
      </div>
    </AdminPageShell>
  );
}
