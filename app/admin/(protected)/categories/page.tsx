import Link from "next/link";
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
        <div className="page-header">
          <div>
            <p className="eyebrow">Catégories</p>
            <h1>Catégories</h1>
            <p className="lead">
              Gérez les catégories du catalogue avec un formulaire simple et
              des validations côté serveur.
            </p>
          </div>

          <Link className="button" href="/admin/categories/new">
            Nouvelle catégorie
          </Link>
        </div>

        {successMessage ? <p className="admin-success">{successMessage}</p> : null}
        {errorMessage ? (
          <p className="admin-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {categories.length > 0 ? (
          <div className="admin-category-list">
            {categories.map((category) => (
              <article className="store-card admin-category-card" key={category.id}>
                <div className="stack">
                  <p className="card-kicker">Catégorie</p>
                  <h2>{category.name}</h2>
                  <p className="card-meta">{category.slug}</p>
                </div>

                <p className="card-copy">
                  {category.description ?? "Aucune description pour cette catégorie."}
                </p>

                <div className="admin-category-tags">
                  <span className="admin-chip">
                    {category.isFeatured ? "Mise en avant" : "Standard"}
                  </span>
                </div>

                <div>
                  <Link className="link" href={`/admin/categories/${category.id}`}>
                    Modifier la catégorie
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucune catégorie</p>
            <h2>Le catalogue ne contient pas encore de catégorie</h2>
            <p className="card-copy">
              Créez une première catégorie pour structurer le catalogue.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
