import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/feedback";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { getAdminCategoryDetail } from "@/features/admin/categories/queries";
import { listAdminMediaAssets } from "@/features/admin/media";
import {
  deleteCategoryAction,
  updateCategoryAction,
  updateCategorySeoAction,
  setCategoryImageAction,
  deleteCategoryImageAction,
} from "@/features/admin/categories";
import { FullWidthPageFrame } from "@/components/shared/layout/full-width-page-frame";
import { FullWidthStack } from "@/components/shared/layout/full-width-stack";

export const dynamic = "force-dynamic";

type EditAdminCategoryPageProps = Readonly<{
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{
    status?: string | string[];
    error?: string | string[];
    image_error?: string | string[];
    image_status?: string | string[];
  }>;
}>;

function readSingleSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Catégorie mise à jour avec succès.";
    default:
      return null;
  }
}

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
    case "invalid_parent_assignment":
      return "Une catégorie ne peut pas être sa propre catégorie parente.";
    case "parent_category_missing":
      return "La catégorie parente sélectionnée est introuvable.";
    case "media_asset_missing":
      return "Le média sélectionné est introuvable.";
    case "save_failed":
      return "La catégorie n'a pas pu être enregistrée.";
    default:
      return null;
  }
}

export default async function EditAdminCategoryPage({
  params,
  searchParams,
}: EditAdminCategoryPageProps) {
  const { id, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const successMessage = getStatusMessage(readSingleSearchParam(resolvedSearchParams.status));
  const errorMessage = getErrorMessage(readSingleSearchParam(resolvedSearchParams.error));

  const [category, mediaAssets] = await Promise.all([
    getAdminCategoryDetail({ categoryId: id, slug }), // Pass slug for potential future use, currently not used in the query
    listAdminMediaAssets(),
  ]);

  if (category === null) {
    notFound();
  }

  async function handleUpdateCategory(formData: FormData): Promise<void> {
    "use server";
    await updateCategoryAction(formData);
  }

  async function handleSetCategoryImage(formData: FormData): Promise<void> {
    "use server";
    const categoryId = String(formData.get("categoryId") ?? "");
    const mediaAssetIdRaw = String(formData.get("mediaAssetId") ?? "");
    await setCategoryImageAction({
      categoryId,
      mediaAssetId: mediaAssetIdRaw.trim().length > 0 ? mediaAssetIdRaw : null,
    });
  }

  async function handleDeleteCategoryImage(formData: FormData): Promise<void> {
    "use server";
    const categoryId = String(formData.get("categoryId") ?? "");
    await deleteCategoryImageAction({ categoryId });
  }

  async function handleDeleteCategory(formData: FormData): Promise<void> {
    "use server";
    const categoryId = String(formData.get("categoryId") ?? "");
    await deleteCategoryAction({ categoryId });
  }

  async function handleUpdateCategorySeo(formData: FormData): Promise<void> {
    "use server";
    await updateCategorySeoAction(formData);
  }

  return (
    <AdminPageShell
      headerVisibility="desktop"
      pageTitleNavigation={{ label: "Retour", href: "/admin/catalog/categories" }}
      description="Mettez à jour les informations visibles dans le catalogue, puis complétez le visuel et le référencement si nécessaire."
      eyebrow="Catégories"
      title="Modifier la catégorie"
      scrollMode="area"
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          <div className="space-y-3">
            {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
            {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.95fr)] xl:items-start">
            <div className="space-y-8">
              <AdminFormSection
                eyebrow="Informations"
                title="Informations principales"
                description="Mettez à jour le nom, l’adresse et le texte affichés dans le catalogue."
                contentClassName="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6"
              >
                <form action={handleUpdateCategory} className="grid gap-5">
                  <input name="categoryId" type="hidden" value={category.id} />
                  <input name="sortOrder" type="hidden" value={String(category.sortOrder)} />
                  <input name="parentId" type="hidden" value={category.parentId ?? ""} />
                  <input
                    name="primaryImageId"
                    type="hidden"
                    value={category.primaryImageId ?? ""}
                  />

                  <AdminFormField htmlFor="cat-name" label="Nom">
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
                    label="Adresse de la catégorie"
                    hint="Visible dans l’URL. Utilisez des lettres minuscules, des chiffres et des tirets."
                  >
                    <Input
                      defaultValue={category.slug}
                      id="cat-slug"
                      name="slug"
                      required
                      type="text"
                    />
                  </AdminFormField>

                  <AdminFormField htmlFor="cat-description" label="Description">
                    <Textarea
                      defaultValue={category.description ?? ""}
                      id="cat-description"
                      name="description"
                      rows={5}
                    />
                  </AdminFormField>

                  <label className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-foreground">
                    <input
                      className="size-4"
                      defaultChecked={category.isFeatured}
                      name="isFeatured"
                      type="checkbox"
                      value="on"
                    />
                    <span>Afficher cette catégorie en avant dans l’administration</span>
                  </label>

                  <AdminFormActions>
                    <Button type="submit">Enregistrer les informations</Button>
                  </AdminFormActions>
                </form>
              </AdminFormSection>

              <AdminFormSection
                eyebrow="Référencement"
                title="Référencement"
                description="Aidez les moteurs de recherche et les aperçus de partage à présenter correctement la catégorie."
                contentClassName="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6"
              >
                <form action={handleUpdateCategorySeo} className="grid gap-5">
                  <input name="categoryId" type="hidden" value={category.id} />

                  <AdminFormField htmlFor="cat-seo-title" label="Titre pour Google">
                    <Input
                      defaultValue={category.seo.metaTitle ?? ""}
                      id="cat-seo-title"
                      maxLength={255}
                      name="title"
                      placeholder={category.name}
                      type="text"
                    />
                  </AdminFormField>

                  <AdminFormField htmlFor="cat-seo-description" label="Description pour Google">
                    <Textarea
                      defaultValue={category.seo.metaDescription ?? ""}
                      id="cat-seo-description"
                      maxLength={320}
                      name="description"
                      placeholder={`Sélection de produits : ${category.name}`}
                      rows={3}
                    />
                  </AdminFormField>

                  <AdminFormField htmlFor="cat-seo-canonical" label="Adresse canonique">
                    <Input
                      defaultValue={category.seo.canonicalPath ?? ""}
                      id="cat-seo-canonical"
                      name="canonicalPath"
                      placeholder="/boutique/categories/..."
                      type="text"
                    />
                  </AdminFormField>

                  <AdminFormField
                    htmlFor="cat-seo-indexing"
                    label="Visibilité dans les moteurs de recherche"
                  >
                    <select
                      className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                      defaultValue={category.seo.indexingMode}
                      id="cat-seo-indexing"
                      name="indexingMode"
                    >
                      <option value="INDEX_FOLLOW">Indexer et suivre les liens</option>
                      <option value="INDEX_NOFOLLOW">Indexer, ne pas suivre les liens</option>
                      <option value="NOINDEX_FOLLOW">Ne pas indexer, suivre les liens</option>
                      <option value="NOINDEX_NOFOLLOW">Ne pas indexer, ne pas suivre</option>
                    </select>
                  </AdminFormField>

                  <label className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-foreground">
                    <input
                      className="size-4"
                      defaultChecked={category.seo.sitemapIncluded}
                      name="sitemapIncluded"
                      type="checkbox"
                      value="true"
                    />
                    <span>Inclure cette catégorie dans le sitemap</span>
                  </label>

                  <AdminFormField htmlFor="cat-og-title" label="Titre d’aperçu de partage">
                    <Input
                      defaultValue={category.seo.openGraphTitle ?? ""}
                      id="cat-og-title"
                      maxLength={255}
                      name="openGraphTitle"
                      type="text"
                    />
                  </AdminFormField>

                  <AdminFormField
                    htmlFor="cat-og-description"
                    label="Description d’aperçu de partage"
                  >
                    <Textarea
                      defaultValue={category.seo.openGraphDescription ?? ""}
                      id="cat-og-description"
                      maxLength={320}
                      name="openGraphDescription"
                      rows={2}
                    />
                  </AdminFormField>

                  <AdminFormField htmlFor="cat-tw-title" label="Titre réseau social">
                    <Input
                      defaultValue={category.seo.twitterTitle ?? ""}
                      id="cat-tw-title"
                      maxLength={255}
                      name="twitterTitle"
                      type="text"
                    />
                  </AdminFormField>

                  <AdminFormField htmlFor="cat-tw-description" label="Description réseau social">
                    <Textarea
                      defaultValue={category.seo.twitterDescription ?? ""}
                      id="cat-tw-description"
                      maxLength={320}
                      name="twitterDescription"
                      rows={2}
                    />
                  </AdminFormField>

                  <AdminFormActions>
                    <Button type="submit">Enregistrer le référencement</Button>
                  </AdminFormActions>
                </form>
              </AdminFormSection>
            </div>

            <div className="space-y-8">
              <AdminFormSection
                eyebrow="Visuel"
                title="Image principale"
                description="Ajoutez un visuel pour identifier plus facilement la catégorie dans l’administration."
                contentClassName="rounded-3xl border border-surface-border bg-card p-5 shadow-card sm:p-6"
              >
                {category.primaryImageUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                    <Image
                      alt={category.name}
                      className="aspect-video w-full object-cover"
                      src={category.primaryImageUrl}
                      width={800}
                      height={450}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center text-sm text-muted-foreground">
                    Aucun visuel associé
                  </div>
                )}

                {mediaAssets.length > 0 ? (
                  <form action={handleSetCategoryImage} className="grid gap-4">
                    <input name="categoryId" type="hidden" value={category.id} />

                    <AdminFormField htmlFor="cat-image-media-asset" label="Choisir un média">
                      <select
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={category.primaryImageId ?? ""}
                        id="cat-image-media-asset"
                        name="mediaAssetId"
                      >
                        <option value="">Aucun média</option>
                        {mediaAssets.map(
                          (asset: { id: string; originalName: string; mimeType: string }) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.originalName} · {asset.mimeType}
                            </option>
                          )
                        )}
                      </select>
                    </AdminFormField>

                    <AdminFormActions>
                      <Button type="submit">Mettre à jour le visuel</Button>
                    </AdminFormActions>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun média disponible.{" "}
                    <Link
                      className="underline underline-offset-4 hover:text-foreground"
                      href="/admin/media"
                    >
                      Ouvrir la médiathèque
                    </Link>
                  </p>
                )}

                {category.primaryImageId ? (
                  <form action={handleDeleteCategoryImage}>
                    <input name="categoryId" type="hidden" value={category.id} />
                    <Button
                      className="w-fit px-0 text-destructive hover:text-destructive"
                      size="sm"
                      type="submit"
                      variant="ghost"
                    >
                      Supprimer l’image
                    </Button>
                  </form>
                ) : null}
              </AdminFormSection>

              <AdminFormSection
                eyebrow="Suppression"
                title="Supprimer la catégorie"
                description="À utiliser seulement si cette catégorie ne doit plus apparaître dans l’administration."
                contentClassName="rounded-3xl border border-feedback-error-border bg-feedback-error-surface/40 p-5 shadow-card sm:p-6"
              >
                <form action={handleDeleteCategory}>
                  <input name="categoryId" type="hidden" value={category.id} />
                  <Button type="submit" variant="destructive">
                    Supprimer la catégorie
                  </Button>
                </form>
              </AdminFormSection>
            </div>
          </div>
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
