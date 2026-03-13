import Link from "next/link";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
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
    <div className="admin-category-page">
      <section className="section">
        <PageHeader
          actions={
            <Link
              className="button"
              href="/admin/categories/new">
              Nouvelle catégorie
            </Link>
          }
          description="Gérez les catégories du catalogue avec un formulaire simple et des validations côté serveur."
          eyebrow="Catégories"
          title="Catégories"
        />

        {successMessage ? (
          <Notice tone="success">{successMessage}</Notice>
        ) : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        {categories.length > 0 ? (
          <div className="admin-category-list">
            {categories.map(category => (
              <AdminCategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        ) : (
          <AdminEmptyState
            eyebrow="Aucune catégorie"
            title="Le catalogue ne contient pas encore de catégorie"
            description="Créez une première catégorie pour structurer le catalogue."
          />
        )}
      </section>
    </div>
  );
}
