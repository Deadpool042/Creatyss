import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
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
      return "Une ou plusieurs catégories sélectionnées sont invalides.";
    case "slug_taken":
      return "Ce slug est déjà utilisé par un autre produit.";
    case "save_failed":
      return "Le produit n'a pas pu être enregistré.";
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
      <PageHeader
        actions={
          <Link
            className="link-subtle button"
            href="/admin/products">
            Retour à la liste
          </Link>
        }
        description="Créez d'abord le produit, choisissez son type, puis complétez ses informations de vente ou ses déclinaisons depuis la page de détail."
        eyebrow="Produits"
        title="Nouveau produit"
      />

      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <form
        action={createProductAction}
        className="admin-form admin-product-form">
        <AdminFormField label="Nom">
          <input
            className="admin-input"
            name="name"
            required
            type="text"
          />
        </AdminFormField>

        <AdminFormField label="Slug">
          <input
            className="admin-input"
            name="slug"
            required
            type="text"
          />
        </AdminFormField>

        <AdminFormField label="Description courte">
          <textarea
            className="admin-input admin-textarea"
            name="shortDescription"
            rows={3}
          />
        </AdminFormField>

        <AdminFormField label="Description">
          <textarea
            className="admin-input admin-textarea"
            name="description"
            rows={6}
          />
        </AdminFormField>

        <AdminFormField label="Titre SEO">
          <input
            className="admin-input"
            name="seoTitle"
            type="text"
          />
        </AdminFormField>

        <AdminFormField label="Description SEO">
          <textarea
            className="admin-input admin-textarea"
            name="seoDescription"
            rows={3}
          />
        </AdminFormField>

        <AdminFormField label="Statut">
          <select
            className="admin-input"
            defaultValue="draft"
            name="status">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </AdminFormField>

        <AdminFormField label="Type de produit">
          <select
            className="admin-input"
            defaultValue="variable"
            name="productType">
            <option value="simple">Produit simple</option>
            <option value="variable">Produit avec déclinaisons</option>
          </select>
        </AdminFormField>

        <p className="admin-muted-note">
          Un produit simple se gère via ses informations de vente. Un produit
          avec déclinaisons pourra accueillir plusieurs déclinaisons.
        </p>

        <fieldset className="admin-fieldset">
          <legend className="meta-label">Catégories</legend>

          {categories.length > 0 ? (
            <div className="admin-checkbox-grid">
              {categories.map(category => (
                <label
                  className="admin-checkbox"
                  key={category.id}>
                  <input
                    name="categoryIds"
                    type="checkbox"
                    value={category.id}
                  />
                  <span>
                    {category.name}
                    <span className="card-meta"> · {category.slug}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="card-copy">
              Aucune catégorie n&apos;est encore disponible. Vous pourrez en
              ajouter plus tard.
            </p>
          )}
        </fieldset>

        <label className="admin-checkbox">
          <input
            name="isFeatured"
            type="checkbox"
            value="on"
          />
          <span>Mettre ce produit en avant</span>
        </label>

        <AdminFormActions>
          <Button
            className="button"
            type="submit">
            Créer le produit
          </Button>
        </AdminFormActions>
      </form>
    </section>
  );
}
