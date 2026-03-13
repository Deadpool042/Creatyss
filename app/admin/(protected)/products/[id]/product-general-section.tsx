import { Notice } from "@/components/notice";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type AdminCategory } from "@/db/repositories/admin-category.repository";
import { type AdminProductDetail } from "@/db/repositories/admin-product.repository";
import { updateProductAction } from "@/features/admin/products/actions/update-product-action";
import { isCategoryAssigned } from "./product-detail-helpers";

type ProductGeneralSectionProps = Readonly<{
  categories: AdminCategory[];
  errorMessage: string | null;
  product: Pick<
    AdminProductDetail,
    | "id"
    | "name"
    | "slug"
    | "shortDescription"
    | "description"
    | "seoTitle"
    | "seoDescription"
    | "status"
    | "productType"
    | "isFeatured"
    | "categoryIds"
  >;
  statusMessage: string | null;
}>;

export function ProductGeneralSection({
  categories,
  errorMessage,
  product,
  statusMessage
}: ProductGeneralSectionProps) {
  const nameId = `product-name-${product.id}`;
  const slugId = `product-slug-${product.id}`;
  const shortDescriptionId = `product-short-description-${product.id}`;
  const descriptionId = `product-description-${product.id}`;
  const seoTitleId = `product-seo-title-${product.id}`;
  const seoDescriptionId = `product-seo-description-${product.id}`;
  const statusId = `product-status-${product.id}`;
  const productTypeId = `product-type-${product.id}`;

  return (
    <section className="section admin-product-section">
      {statusMessage ? <Notice tone="success">{statusMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <form
        action={updateProductAction}
        className="admin-form admin-product-form">
        <input
          name="productId"
          type="hidden"
          value={product.id}
        />

        <AdminFormSection
          contentClassName="gap-5"
          description="Modifiez ici le catalogue, le texte public et la publication du produit."
          eyebrow="Informations générales"
          title="Informations produit">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminFormField
              htmlFor={nameId}
              label="Nom">
              <Input
                defaultValue={product.name}
                id={nameId}
                name="name"
                required
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={slugId}
              label="Slug">
              <Input
                defaultValue={product.slug}
                id={slugId}
                name="slug"
                required
                type="text"
              />
            </AdminFormField>
          </div>

          <AdminFormField
            htmlFor={shortDescriptionId}
            label="Description courte">
            <Textarea
              defaultValue={product.shortDescription ?? ""}
              id={shortDescriptionId}
              name="shortDescription"
              rows={3}
            />
          </AdminFormField>

          <AdminFormField
            htmlFor={descriptionId}
            label="Description">
            <Textarea
              defaultValue={product.description ?? ""}
              id={descriptionId}
              name="description"
              rows={6}
            />
          </AdminFormField>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminFormField
              htmlFor={seoTitleId}
              label="Titre SEO">
              <Input
                defaultValue={product.seoTitle ?? ""}
                id={seoTitleId}
                name="seoTitle"
                type="text"
              />
            </AdminFormField>

            <AdminFormField
              htmlFor={seoDescriptionId}
              label="Description SEO">
              <Textarea
                defaultValue={product.seoDescription ?? ""}
                id={seoDescriptionId}
                name="seoDescription"
                rows={3}
              />
            </AdminFormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminFormField
              htmlFor={statusId}
              label="Statut">
              <select
                className="admin-input"
                defaultValue={product.status}
                id={statusId}
                name="status">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </AdminFormField>

            <AdminFormField
              htmlFor={productTypeId}
              label="Type de produit">
              <select
                className="admin-input"
                defaultValue={product.productType}
                id={productTypeId}
                name="productType">
                <option value="simple">Produit simple</option>
                <option value="variable">Produit avec déclinaisons</option>
              </select>
            </AdminFormField>
          </div>

          <fieldset className="admin-fieldset grid gap-3">
            <legend className="meta-label">Catégories associées</legend>

            {categories.length > 0 ? (
              <div className="admin-checkbox-grid">
                {categories.map(category => (
                  <label
                    className="admin-checkbox"
                    key={category.id}>
                    <input
                      defaultChecked={isCategoryAssigned(
                        product.categoryIds,
                        category.id
                      )}
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
                Aucune catégorie n&apos;est encore disponible pour ce produit.
              </p>
            )}
          </fieldset>

          <label className="admin-checkbox">
            <input
              defaultChecked={product.isFeatured}
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
              Enregistrer le produit
            </Button>
          </AdminFormActions>
        </AdminFormSection>
      </form>
    </section>
  );
}
