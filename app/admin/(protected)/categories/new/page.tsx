import Link from "next/link";
import { createCategoryAction } from "@/features/admin/categories/actions/create-category-action";

export const dynamic = "force-dynamic";

type NewAdminCategoryPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_name":
      return "Le nom est obligatoire.";
    case "missing_slug":
      return "Le slug est obligatoire.";
    case "invalid_slug":
      return "Renseignez un slug valide.";
    case "slug_taken":
      return "Ce slug est deja utilise par une autre categorie.";
    case "save_failed":
      return "La categorie n'a pas pu etre enregistree.";
    default:
      return null;
  }
}

export default async function NewAdminCategoryPage({
  searchParams
}: NewAdminCategoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);

  return (
    <section className="section admin-category-form-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Categories</p>
          <h1>Nouvelle categorie</h1>
          <p className="lead">
            Creez une categorie simple pour organiser le catalogue.
          </p>
        </div>

        <Link className="link-subtle button" href="/admin/categories">
          Retour a la liste
        </Link>
      </div>

      {errorMessage ? (
        <p className="admin-alert" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <form action={createCategoryAction} className="admin-form admin-category-form">
        <label className="admin-field">
          <span className="meta-label">Nom</span>
          <input className="admin-input" name="name" required type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Slug</span>
          <input className="admin-input" name="slug" required type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Description</span>
          <textarea className="admin-input admin-textarea" name="description" rows={5} />
        </label>

        <label className="admin-checkbox">
          <input name="isFeatured" type="checkbox" value="on" />
          <span>Mettre cette categorie en avant</span>
        </label>

        <div className="admin-actions">
          <button className="button" type="submit">
            Creer la categorie
          </button>
        </div>
      </form>
    </section>
  );
}
