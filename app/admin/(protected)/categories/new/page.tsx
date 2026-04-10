import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/notice";
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
      description="Création d’une catégorie de catalogue."
      eyebrow="Catégories"
      title="Nouvelle catégorie"
    >
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <AdminFormSection>
        <form action={handleCreateCategory} className="grid gap-4">
          <AdminFormField htmlFor="cat-name" label="Nom">
            <Input id="cat-name" name="name" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="cat-slug" label="Slug">
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
            <Button type="submit">Créer</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
