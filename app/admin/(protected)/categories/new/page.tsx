import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/notice";
import { AdminPageShell } from "@/components/theme/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
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
      return "Ce slug est déjà utilisé par une autre catégorie.";
    case "save_failed":
      return "La catégorie n'a pas pu être enregistrée.";
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
    <AdminPageShell
      actions={
        <Button
          asChild
          size="sm"
          variant="outline">
          <Link href="/admin/categories">Retour à la liste</Link>
        </Button>
      }
      description="Créez une catégorie simple pour organiser le catalogue."
      eyebrow="Catégories"
      title="Nouvelle catégorie">
      {errorMessage ? (
        <Notice tone="alert">{errorMessage}</Notice>
      ) : null}

      <AdminFormSection>
        <form
          action={createCategoryAction}
          className="grid gap-4">
          <AdminFormField
            htmlFor="cat-name"
            label="Nom">
            <Input
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
              id="cat-description"
              name="description"
              rows={5}
            />
          </AdminFormField>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              className="size-4"
              name="isFeatured"
              type="checkbox"
              value="on"
            />
            <span>Mettre cette catégorie en avant</span>
          </label>

          <AdminFormActions>
            <Button type="submit">Créer la catégorie</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
