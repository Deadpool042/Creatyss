import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/notice";
import { AdminPageShell } from "@/components/theme/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
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
      return "Ce slug est déjà utilisé par une autre catégorie.";
    case "in_use":
      return "Cette catégorie ne peut pas être supprimée car elle est encore utilisée par au moins un produit.";
    case "referenced":
      return "Cette catégorie ne peut pas être supprimée car elle est encore référencée ailleurs.";
    case "save_failed":
      return "La catégorie n'a pas pu être mise à jour.";
    case "delete_failed":
      return "La catégorie n'a pas pu être supprimée.";
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
    <AdminPageShell
      actions={
        <Button
          asChild
          size="sm"
          variant="outline">
          <Link href="/admin/categories">Retour à la liste</Link>
        </Button>
      }
      description="Modifiez d'abord les informations de la catégorie. La suppression reste disponible séparément en bas de page."
      eyebrow="Catégories"
      title="Modifier la catégorie">
      {errorMessage ? (
        <Notice tone="alert">{errorMessage}</Notice>
      ) : null}

      <AdminFormSection>
        <form
          action={updateCategoryAction}
          className="grid gap-4">
          <input
            name="categoryId"
            type="hidden"
            value={category.id}
          />

          <AdminFormField
            htmlFor="cat-name"
            label="Nom">
            <Input
              defaultValue={category.name}
              id="cat-name"
              name="name"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField
            htmlFor="cat-slug"
            label="Slug">
            <Input
              defaultValue={category.slug}
              id="cat-slug"
              name="slug"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField
            htmlFor="cat-description"
            label="Description">
            <Textarea
              defaultValue={category.description ?? ""}
              id="cat-description"
              name="description"
              rows={5}
            />
          </AdminFormField>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              className="size-4"
              defaultChecked={category.isFeatured}
              name="isFeatured"
              type="checkbox"
              value="on"
            />
            <span>Mettre cette catégorie en avant</span>
          </label>

          <AdminFormActions>
            <Button type="submit">Enregistrer les modifications</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>

      <AdminFormSection
        description="La suppression est refusée tant que cette catégorie est encore utilisée par un produit."
        eyebrow="Suppression"
        title="Supprimer cette catégorie">
        <form action={deleteCategoryAction}>
          <input
            name="categoryId"
            type="hidden"
            value={category.id}
          />

          <Button
            type="submit"
            variant="destructive">
            Supprimer la catégorie
          </Button>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
