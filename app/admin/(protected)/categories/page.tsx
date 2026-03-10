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
      return "Categorie creee avec succes.";
    case "updated":
      return "Categorie mise a jour avec succes.";
    case "deleted":
      return "Categorie supprimee avec succes.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_category":
      return "La categorie demandee est introuvable.";
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
            <p className="eyebrow">Categories</p>
            <h1>Categories admin</h1>
            <p className="lead">
              Gere les categories du catalogue avec un formulaire simple et des
              validations cote serveur.
            </p>
          </div>

          <Link className="button" href="/admin/categories/new">
            Nouvelle categorie
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
                  <p className="card-kicker">Categorie</p>
                  <h2>{category.name}</h2>
                  <p className="card-meta">{category.slug}</p>
                </div>

                <p className="card-copy">
                  {category.description ?? "Aucune description pour cette categorie."}
                </p>

                <div className="admin-category-tags">
                  <span className="admin-chip">
                    {category.isFeatured ? "Mise en avant" : "Standard"}
                  </span>
                </div>

                <div>
                  <Link className="link" href={`/admin/categories/${category.id}`}>
                    Modifier la categorie
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucune categorie</p>
            <h2>Le catalogue ne contient pas encore de categorie admin</h2>
            <p className="card-copy">
              Creez une premiere categorie pour structurer le catalogue.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
