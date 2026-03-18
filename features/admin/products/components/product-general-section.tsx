import { Notice } from "@/components/shared/notice";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type AdminCategory } from "@/db/repositories/admin-category.repository";
import { type AdminProductDetail } from "@/db/repositories/admin-product.repository";
import { updateProductAction } from "@/features/admin/products/actions";
import { isCategoryAssigned } from "@/features/admin/products/lib";

const nativeSelectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

const fieldsetClassName =
  "grid gap-4 rounded-xl border border-border/60 bg-muted/10 p-4";

const legendClassName =
  "px-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground";

const checkboxInputClassName =
  "mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

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
    <section className="space-y-4">
      {statusMessage ? <Notice tone="success">{statusMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <form
        action={updateProductAction}
        className="space-y-4">
        <input
          name="productId"
          type="hidden"
          value={product.id}
        />

        <AdminFormSection
          contentClassName="gap-6"
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
                className={nativeSelectClassName}
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
                className={nativeSelectClassName}
                defaultValue={product.productType}
                id={productTypeId}
                name="productType">
                <option value="simple">Produit simple</option>
                <option value="variable">Produit avec déclinaisons</option>
              </select>
            </AdminFormField>
          </div>

          <fieldset className={fieldsetClassName}>
            <legend className={legendClassName}>Catégories associées</legend>

            {categories.length > 0 ? (
              <div className="grid gap-3">
                {categories.map(category => (
                  <label
                    className="flex items-start gap-3 text-sm leading-6 text-foreground"
                    key={category.id}>
                    <input
                      className={checkboxInputClassName}
                      defaultChecked={isCategoryAssigned(
                        product.categoryIds,
                        category.id
                      )}
                      name="categoryIds"
                      type="checkbox"
                      value={category.id}
                    />
                    <span className="grid gap-1">
                      <span className="font-medium text-foreground">
                        {category.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {category.slug}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                Aucune catégorie n&apos;est encore disponible pour ce produit.
              </p>
            )}
          </fieldset>

          <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
            <input
              className={checkboxInputClassName}
              defaultChecked={product.isFeatured}
              name="isFeatured"
              type="checkbox"
              value="on"
            />
            <span>Mettre ce produit en avant</span>
          </label>

          <AdminFormActions>
            <Button
              className="w-full sm:w-auto"
              type="submit">
              Enregistrer le produit
            </Button>
          </AdminFormActions>
        </AdminFormSection>
      </form>
    </section>
  );
}
