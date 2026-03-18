import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/notice";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { listAdminCategories } from "@/db/repositories/admin-category.repository";
import { createProductAction } from "@/features/admin/products/actions/create-product-action";

export const dynamic = "force-dynamic";

type NewAdminProductPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

const newProductFieldIds = {
  name: "new-product-name",
  slug: "new-product-slug",
  shortDescription: "new-product-short-description",
  description: "new-product-description",
  seoTitle: "new-product-seo-title",
  seoDescription: "new-product-seo-description",
  status: "new-product-status",
  productType: "new-product-type"
} as const;

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
    <AdminPageShell
      actions={
        <Button
          asChild
          size="sm"
          variant="outline">
          <Link href="/admin/products">Retour à la liste</Link>
        </Button>
      }
      description="Créez d'abord le produit, choisissez son type, puis complétez ses informations de vente ou ses déclinaisons depuis la page de détail."
      eyebrow="Produits"
      title="Nouveau produit">
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <form
        action={createProductAction}
        className="grid gap-6">
        <AdminFormSection title="Informations générales">
          <AdminFormField
            htmlFor={newProductFieldIds.name}
            label="Nom">
            <Input
              id={newProductFieldIds.name}
              name="name"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField
            htmlFor={newProductFieldIds.slug}
            label="Slug">
            <Input
              id={newProductFieldIds.slug}
              name="slug"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField
            htmlFor={newProductFieldIds.shortDescription}
            label="Description courte">
            <Textarea
              id={newProductFieldIds.shortDescription}
              name="shortDescription"
              rows={3}
            />
          </AdminFormField>

          <AdminFormField
            htmlFor={newProductFieldIds.description}
            label="Description">
            <Textarea
              id={newProductFieldIds.description}
              name="description"
              rows={6}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Référencement">
          <AdminFormField
            htmlFor={newProductFieldIds.seoTitle}
            label="Titre SEO">
            <Input
              id={newProductFieldIds.seoTitle}
              name="seoTitle"
              type="text"
            />
          </AdminFormField>

          <AdminFormField
            htmlFor={newProductFieldIds.seoDescription}
            label="Description SEO">
            <Textarea
              id={newProductFieldIds.seoDescription}
              name="seoDescription"
              rows={3}
            />
          </AdminFormField>
        </AdminFormSection>

        <AdminFormSection title="Publication et organisation">
          <AdminFormField
            htmlFor={newProductFieldIds.status}
            label="Statut">
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue="draft"
              id={newProductFieldIds.status}
              name="status">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </AdminFormField>

          <AdminFormField
            description="Un produit simple se gère via ses informations de vente. Un produit avec déclinaisons pourra accueillir plusieurs déclinaisons."
            htmlFor={newProductFieldIds.productType}
            label="Type de produit">
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue="variable"
              id={newProductFieldIds.productType}
              name="productType">
              <option value="simple">Produit simple</option>
              <option value="variable">Produit avec déclinaisons</option>
            </select>
          </AdminFormField>

          <div className="grid gap-2">
            <p className="text-sm font-medium leading-none">Catégories</p>
            {categories.length > 0 ? (
              <div className="grid gap-2">
                {categories.map(category => (
                  <label
                    className="flex items-center gap-3 text-sm text-foreground"
                    key={category.id}>
                    <input
                      className="size-4"
                      name="categoryIds"
                      type="checkbox"
                      value={category.id}
                    />
                    <span>
                      {category.name}
                      <span className="text-muted-foreground">
                        {" "}
                        · {category.slug}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Aucune catégorie n&apos;est encore disponible. Vous pourrez en
                ajouter plus tard.
              </p>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              className="size-4"
              name="isFeatured"
              type="checkbox"
              value="on"
            />
            <span>Mettre ce produit en avant</span>
          </label>
        </AdminFormSection>

        <AdminFormActions>
          <Button type="submit">Créer le produit</Button>
        </AdminFormActions>
      </form>
    </AdminPageShell>
  );
}
