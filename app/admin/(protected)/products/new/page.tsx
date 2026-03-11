import Link from "next/link";
import { listAdminCategories } from "@/db/repositories/admin-category.repository";
import { createProductAction } from "@/features/admin/products/actions/create-product-action";

export const dynamic = "force-dynamic";

type NewAdminProductPageProps = Readonly<{
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
    case "invalid_status":
      return "Le statut du produit est invalide.";
    case "invalid_product_type":
      return "Le type de produit est invalide.";
    case "invalid_category_ids":
      return "Une ou plusieurs categories selectionnees sont invalides.";
    case "slug_taken":
      return "Ce slug est deja utilise par un autre produit.";
    case "save_failed":
      return "Le produit n'a pas pu etre enregistre.";
    default:
      return null;
  }
}

export default async function NewAdminProductPage({
  searchParams
}: NewAdminProductPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);
  const categories = await listAdminCategories();

  return (
    <section className="section admin-product-form-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Produits</p>
          <h1>Nouveau produit</h1>
          <p className="lead">
            Creez d&apos;abord le produit, choisissez son type, puis completez
            son offre vendable ou ses declinaisons depuis la page de detail.
          </p>
        </div>

        <Link className="link-subtle button" href="/admin/products">
          Retour a la liste
        </Link>
      </div>

      {errorMessage ? (
        <p className="admin-alert" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <form action={createProductAction} className="admin-form admin-product-form">
        <label className="admin-field">
          <span className="meta-label">Nom</span>
          <input className="admin-input" name="name" required type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Slug</span>
          <input className="admin-input" name="slug" required type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Description courte</span>
          <textarea
            className="admin-input admin-textarea"
            name="shortDescription"
            rows={3}
          />
        </label>

        <label className="admin-field">
          <span className="meta-label">Description</span>
          <textarea
            className="admin-input admin-textarea"
            name="description"
            rows={6}
          />
        </label>

        <label className="admin-field">
          <span className="meta-label">SEO title</span>
          <input className="admin-input" name="seoTitle" type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">SEO description</span>
          <textarea
            className="admin-input admin-textarea"
            name="seoDescription"
            rows={3}
          />
        </label>

        <label className="admin-field">
          <span className="meta-label">Statut</span>
          <select className="admin-input" defaultValue="draft" name="status">
            <option value="draft">Brouillon</option>
            <option value="published">Publie</option>
          </select>
        </label>

        <label className="admin-field">
          <span className="meta-label">Type de produit</span>
          <select className="admin-input" defaultValue="variable" name="productType">
            <option value="simple">Simple</option>
            <option value="variable">Variable</option>
          </select>
        </label>

        <p className="admin-muted-note">
          Un produit simple utilisera une seule offre vendable. Un produit
          variable pourra accueillir plusieurs declinaisons.
        </p>

        <fieldset className="admin-fieldset">
          <legend className="meta-label">Categories</legend>

          {categories.length > 0 ? (
            <div className="admin-checkbox-grid">
              {categories.map((category) => (
                <label className="admin-checkbox" key={category.id}>
                  <input name="categoryIds" type="checkbox" value={category.id} />
                  <span>
                    {category.name}
                    <span className="card-meta"> · {category.slug}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="card-copy">
              Aucune categorie n&apos;est encore disponible. Vous pourrez en
              ajouter plus tard.
            </p>
          )}
        </fieldset>

        <label className="admin-checkbox">
          <input name="isFeatured" type="checkbox" value="on" />
          <span>Mettre ce produit en avant</span>
        </label>

        <div className="admin-actions">
          <button className="button" type="submit">
            Creer le produit
          </button>
        </div>
      </form>
    </section>
  );
}
