import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/notice";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminCategoryCard } from "@/components/admin/admin-category-card";
import { listAdminCategories } from "@/db/repositories/admin-category.repository";

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

export default async function AdminCategoriesPage({
  searchParams
}: AdminCategoriesPageProps) {
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
      actions={
        <Button
          asChild
          size="sm"
          variant="outline">
          <Link href="/admin/categories/new">Nouvelle catégorie</Link>
        </Button>
      }
      description="Gérez les catégories du catalogue avec un formulaire simple et des validations côté serveur."
      eyebrow="Catégories"
      title="Catégories">
      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      {categories.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          {categories.map(category => (
            <AdminCategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      ) : (
        <AdminEmptyState
          description="Créez une première catégorie pour structurer le catalogue."
          eyebrow="Aucune catégorie"
          title="Le catalogue ne contient pas encore de catégorie"
        />
      )}
    </AdminPageShell>
  );
}
