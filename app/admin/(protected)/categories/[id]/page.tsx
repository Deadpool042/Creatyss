import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { getAdminCategoryDetail } from "@/features/admin/categories/queries";
import { listAdminMediaAssets } from "@/features/admin/media";
import {
  deleteCategoryAction,
  updateCategoryAction,
  setCategoryImageAction,
  deleteCategoryImageAction,
} from "@/features/admin/categories";

export const dynamic = "force-dynamic";

type EditAdminCategoryPageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string | string[];
    image_error?: string | string[];
    image_status?: string | string[];
  }>;
}>;

export default async function EditAdminCategoryPage({
  params,
}: EditAdminCategoryPageProps) {
  const { id } = await params;

  const [category, mediaAssets] = await Promise.all([
    getAdminCategoryDetail({ categoryId: id }),
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

  return (
    <AdminPageShell
      pageTitleNavigation={{ label: "Retour", href: "/admin/categories" }}
      description="Gestion de la catégorie."
      eyebrow="Catégories"
      title="Modifier la catégorie"
    >
      <AdminFormSection>
        <form action={handleUpdateCategory} className="grid gap-4">
          <input name="categoryId" type="hidden" value={category.id} />
          <input name="sortOrder" type="hidden" value={String(category.sortOrder)} />
          <input name="parentId" type="hidden" value={category.parentId ?? ""} />
          <input name="primaryImageId" type="hidden" value={category.primaryImageId ?? ""} />

          <AdminFormField htmlFor="cat-name" label="Nom">
            <Input defaultValue={category.name} id="cat-name" name="name" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="cat-slug" label="Slug">
            <Input defaultValue={category.slug} id="cat-slug" name="slug" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="cat-description" label="Description">
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
            <span>Mise en avant</span>
          </label>

          <AdminFormActions>
            <Button type="submit">Enregistrer</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>

      <AdminFormSection eyebrow="Visuel" title="Image principale">
        {category.primaryImageUrl ? (
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Image
              alt={category.name}
              className="aspect-video w-full object-cover"
              src={category.primaryImageUrl}
              width={800}
              height={450}
            />
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center text-sm text-muted-foreground">
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
                {mediaAssets.map((asset: { id: string; originalName: string; mimeType: string }) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.originalName} · {asset.mimeType}
                  </option>
                ))}
              </select>
            </AdminFormField>

            <AdminFormActions>
              <Button type="submit">Mettre à jour</Button>
            </AdminFormActions>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun média disponible.{" "}
            <Link className="underline underline-offset-4 hover:text-foreground" href="/admin/media">
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

      <AdminFormSection eyebrow="Suppression" title="Supprimer la catégorie">
        <form action={handleDeleteCategory}>
          <input name="categoryId" type="hidden" value={category.id} />
          <Button type="submit" variant="destructive">
            Supprimer
          </Button>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
