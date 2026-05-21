import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/feedback";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { createCategoryAction } from "@/features/admin/categories";

export const dynamic = "force-dynamic";

type NewAdminCategoryPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_name":
      return "Nom requis.";
    case "missing_slug":
      return "Slug requis.";
    case "invalid_slug":
      return "Slug invalide.";
    case "category_slug_taken":
      return "Une catégorie utilise déjà cette adresse.";
    case "parent_category_missing":
      return "La catégorie parente sélectionnée est introuvable.";
    case "media_asset_missing":
      return "Le média sélectionné est introuvable.";
    case "save_failed":
      return "La catégorie n'a pas pu être créée.";
    default:
      return null;
  }
}

export default async function NewAdminCategoryPage({ searchParams }: NewAdminCategoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);

  async function handleCreateCategory(formData: FormData): Promise<void> {
    "use server";
    await createCategoryAction(formData);
  }

  return (
    <AdminPageShell
      pageTitleNavigation={{ label: "Retour", href: "/admin/categories" }}
      description="Créez une catégorie simple pour structurer le catalogue."
      eyebrow="Catégories"
      title="Nouvelle catégorie"
      scrollMode="area"
    >
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <AdminFormSection
        eyebrow="Informations"
        title="Informations principales"
        description="Renseignez les éléments visibles dans le catalogue. Vous pourrez compléter le visuel et le référencement ensuite."
        contentClassName="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6"
      >
        <form action={handleCreateCategory} className="grid gap-5">
          <AdminFormField htmlFor="cat-name" label="Nom">
            <Input id="cat-name" name="name" required type="text" />
          </AdminFormField>

          <AdminFormField
            htmlFor="cat-slug"
            label="Adresse de la catégorie"
            hint="Visible dans l’URL. Utilisez des lettres minuscules, des chiffres et des tirets."
          >
            <Input id="cat-slug" name="slug" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="cat-description" label="Description">
            <Textarea id="cat-description" name="description" rows={5} />
          </AdminFormField>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input className="size-4" name="isFeatured" type="checkbox" value="on" />
            <span>Mise en avant</span>
          </label>

          <input type="hidden" name="sortOrder" value="0" />
          <input type="hidden" name="parentId" value="" />
          <input type="hidden" name="primaryImageId" value="" />

          <AdminFormActions>
            <Button type="submit">Créer la catégorie</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
