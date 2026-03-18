import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/notice";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { listAdminMediaAssets } from "@/db/admin-media";
import { findAdminCategoryById } from "@/db/repositories/admin-category.repository";
import { getUploadsPublicPath } from "@/lib/uploads";
import { deleteCategoryAction } from "@/features/admin/categories/actions/delete-category-action";
import { updateCategoryAction } from "@/features/admin/categories/actions/update-category-action";
import { setCategoryImageAction } from "@/features/admin/categories/actions/set-category-image-action";
import { deleteCategoryImageAction } from "@/features/admin/categories/actions/delete-category-image-action";

export const dynamic = "force-dynamic";

type EditAdminCategoryPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string | string[];
    image_error?: string | string[];
    image_status?: string | string[];
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

function getImageErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_media":
      return "Sélectionnez un média avant d'enregistrer.";
    case "media_not_found":
      return "Le média sélectionné est introuvable.";
    default:
      return null;
  }
}

function getImageStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "L'image de la catégorie a été mise à jour.";
    case "deleted":
      return "L'image de la catégorie a été supprimée.";
    default:
      return null;
  }
}

const nativeSelectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

export default async function EditAdminCategoryPage({
  params,
  searchParams
}: EditAdminCategoryPageProps) {
  const { id } = await params;
  const [category, mediaAssets, resolvedSearchParams] = await Promise.all([
    findAdminCategoryById(id),
    listAdminMediaAssets(),
    searchParams
  ]);

  if (category === null) {
    notFound();
  }

  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);

  const imageErrorParam = Array.isArray(resolvedSearchParams.image_error)
    ? resolvedSearchParams.image_error[0]
    : resolvedSearchParams.image_error;
  const imageErrorMessage = getImageErrorMessage(imageErrorParam);

  const imageStatusParam = Array.isArray(resolvedSearchParams.image_status)
    ? resolvedSearchParams.image_status[0]
    : resolvedSearchParams.image_status;
  const imageStatusMessage = getImageStatusMessage(imageStatusParam);

  const uploadsPublicPath = getUploadsPublicPath();
  const currentImageUrl = category.imagePath
    ? `${uploadsPublicPath}/${category.imagePath.replace(/^\/+/, "")}`
    : null;
  const currentMediaAsset = category.imagePath
    ? (mediaAssets.find(a => a.filePath === category.imagePath) ?? null)
    : null;

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
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

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
        description="Cette image illustre la catégorie dans l'interface d'administration. Sélectionnez un média depuis la bibliothèque."
        eyebrow="Visuel"
        title="Image de la catégorie">
        {imageErrorMessage ? (
          <Notice tone="alert">{imageErrorMessage}</Notice>
        ) : null}
        {imageStatusMessage ? (
          <Notice tone="success">{imageStatusMessage}</Notice>
        ) : null}

        {currentImageUrl ? (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-xs">
            <img
              alt={category.name}
              className="aspect-video w-full object-cover"
              src={currentImageUrl}
            />
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center text-sm leading-6 text-muted-foreground">
            Aucune image pour cette catégorie
          </div>
        )}

        {mediaAssets.length > 0 ? (
          <form
            action={setCategoryImageAction}
            className="grid gap-4">
            <input
              name="categoryId"
              type="hidden"
              value={category.id}
            />
            <AdminFormField
              htmlFor="cat-image-media-asset"
              label="Choisir un média">
              <select
                className={nativeSelectClassName}
                defaultValue={currentMediaAsset?.id ?? ""}
                id="cat-image-media-asset"
                name="mediaAssetId">
                <option
                  disabled
                  value="">
                  Sélectionnez un média
                </option>
                {mediaAssets.map(asset => (
                  <option
                    key={asset.id}
                    value={asset.id}>
                    {asset.originalName} · {asset.mimeType}
                  </option>
                ))}
              </select>
            </AdminFormField>
            <AdminFormActions>
              <Button type="submit">
                {category.imagePath ? "Changer l'image" : "Définir l'image"}
              </Button>
            </AdminFormActions>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun média disponible.{" "}
            <Link
              className="underline underline-offset-4 hover:text-foreground"
              href="/admin/media">
              Importer un média
            </Link>
          </p>
        )}

        {category.imagePath ? (
          <form action={deleteCategoryImageAction}>
            <input
              name="categoryId"
              type="hidden"
              value={category.id}
            />
            <Button
              className="w-fit px-0 text-destructive hover:bg-transparent hover:text-destructive"
              size="sm"
              type="submit"
              variant="ghost">
              Supprimer l&apos;image
            </Button>
          </form>
        ) : null}
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
