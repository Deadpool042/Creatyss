import Link from "next/link";
import { notFound } from "next/navigation";
import { findAdminCategoryById } from "@/db/repositories/admin-category.repository";
import { deleteCategoryAction } from "@/features/admin/categories/actions/delete-category-action";
import { updateCategoryAction } from "@/features/admin/categories/actions/update-category-action";

export const dynamic = "force-dynamic";

type EditAdminCategoryPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
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
    case "in_use":
      return "Cette categorie ne peut pas etre supprimee car elle est encore utilisee par au moins un produit.";
    case "referenced":
      return "Cette categorie ne peut pas etre supprimee car elle est encore referencee ailleurs.";
    case "save_failed":
      return "La categorie n'a pas pu etre mise a jour.";
    case "delete_failed":
      return "La categorie n'a pas pu etre supprimee.";
    default:
      return null;
  }
}

export default async function EditAdminCategoryPage({
  params,
  searchParams
}: EditAdminCategoryPageProps) {
  const { id } = await params;
  const category = await findAdminCategoryById(id);

  if (category === null) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);

  return (
    <div className="admin-category-page">
      <section className="section admin-category-form-section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Categories</p>
            <h1>Modifier la categorie</h1>
            <p className="lead">
              Ajustez les informations de cette categorie et gerez sa suppression
              depuis le meme ecran.
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

        <form action={updateCategoryAction} className="admin-form admin-category-form">
          <input name="categoryId" type="hidden" value={category.id} />

          <label className="admin-field">
            <span className="meta-label">Nom</span>
            <input
              className="admin-input"
              defaultValue={category.name}
              name="name"
              required
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Slug</span>
            <input
              className="admin-input"
              defaultValue={category.slug}
              name="slug"
              required
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Description</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={category.description ?? ""}
              name="description"
              rows={5}
            />
          </label>

          <label className="admin-checkbox">
            <input
              defaultChecked={category.isFeatured}
              name="isFeatured"
              type="checkbox"
              value="on"
            />
            <span>Mettre cette categorie en avant</span>
          </label>

          <div className="admin-actions">
            <button className="button" type="submit">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </section>

      <section className="section admin-danger-zone">
        <div className="stack">
          <p className="eyebrow">Suppression</p>
          <h2>Supprimer cette categorie</h2>
          <p className="card-copy">
            La suppression sera refusee si la categorie est encore utilisee par
            au moins un produit.
          </p>
        </div>

        <form action={deleteCategoryAction}>
          <input name="categoryId" type="hidden" value={category.id} />

          <button className="button admin-danger-button" type="submit">
            Supprimer la categorie
          </button>
        </form>
      </section>
    </div>
  );
}
