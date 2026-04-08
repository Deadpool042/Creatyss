import { redirect } from "next/navigation";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminCollectionSection } from "@/components/admin/admin-collection-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/shared/notice";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminMediaAssetCard } from "@/components/admin/media/admin-media-asset-card";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  listAdminMediaAssets,
  uploadAdminMedia,
  MediaUploadError,
  type AdminMediaListItem,
} from "@/features/admin/media";

export const dynamic = "force-dynamic";

const mediaDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

type MediaPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function formatByteSize(byteSize: number | null): string {
  if (byteSize === null || !Number.isFinite(byteSize) || byteSize <= 0) {
    return "Indisponible";
  }

  if (byteSize >= 1024 * 1024) {
    return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (byteSize >= 1024) {
    return `${Math.round(byteSize / 1024)} KB`;
  }

  return `${byteSize} o`;
}

function getErrorMessage(errorCode: string | undefined): string | null {
  switch (errorCode) {
    case "missing_file":
      return "Sélectionnez une image à importer.";
    case "empty_file":
      return "Le fichier sélectionné est vide.";
    case "file_too_large":
      return "Le fichier dépasse la limite de 10 MB.";
    case "unsupported_file":
      return "Seules les images JPEG, PNG et WebP sont acceptées.";
    case "write_failed":
      return "Le fichier n'a pas pu être enregistré localement.";
    case "database_insert_failed":
      return "Le fichier a été refusé lors de l'enregistrement en base.";
    case "upload_failed":
      return "L'import du média a échoué.";
    default:
      return null;
  }
}

function formatDimensions(asset: Pick<AdminMediaListItem, "imageWidth" | "imageHeight">): string {
  return asset.imageWidth !== null && asset.imageHeight !== null
    ? `${asset.imageWidth} × ${asset.imageHeight}`
    : "Indisponibles";
}

async function uploadMediaAction(formData: FormData) {
  "use server";

  await requireAuthenticatedAdmin();

  try {
    await uploadAdminMedia({
      file: formData.get("file"),
    });
  } catch (error) {
    const errorCode = error instanceof MediaUploadError ? error.code : "upload_failed";

    redirect(`/admin/media?error=${errorCode}`);
  }

  redirect("/admin/media?status=uploaded");
}

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = statusParam === "uploaded" ? "Média importé avec succès." : null;
  const errorMessage = getErrorMessage(errorParam);
  const assets = await listAdminMediaAssets();

  return (
    <AdminPageShell
      mode="viewport"
      variant="tool"
      compactMobileTitle
      eyebrow="Médias"
      title="Bibliothèque médias"
      description="Importez et réutilisez vos visuels dans le catalogue et les contenus."
      pageTitleAction={{ label: "Importer", href: "/admin/media#admin-media-upload" }}
      actions={
        <Button asChild size="sm" className="w-full sm:min-w-40 sm:w-auto">
          <a href="#admin-media-upload">Importer</a>
        </Button>
      }
      scrollMode="nested"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-6 [@media(max-height:480px)]:gap-3">
        {successMessage ? (
          <div className="shrink-0">
            <Notice tone="success">{successMessage}</Notice>
          </div>
        ) : null}
        {errorMessage ? (
          <div className="shrink-0">
            <Notice tone="alert">{errorMessage}</Notice>
          </div>
        ) : null}

          <div id="admin-media-upload" className="shrink-0 scroll-mt-24">
            <AdminFormSection
              description="Ajoutez ici une image prête à être réutilisée. Formats acceptés : JPEG, PNG, WebP. Taille maximale : 10 MB."
              eyebrow="Import"
              title="Importer une image"
            >
              <form
                action={uploadMediaAction}
                className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start"
              >
                <div className="rounded-2xl border border-surface-border bg-surface-panel-soft p-4">
                  <AdminFormField
                    htmlFor="media-file"
                    label="Image"
                    description="Sélectionnez un fichier source depuis votre poste. Le média reste ensuite immédiatement disponible dans l'administration."
                    required
                  >
                    <Input
                      accept="image/jpeg,image/png,image/webp"
                      className="h-11 rounded-2xl border-surface-border bg-card px-3 shadow-none file:mr-3 file:rounded-full file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary"
                      id="media-file"
                      name="file"
                      required
                      type="file"
                    />
                  </AdminFormField>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
                    <p>
                      Réutilisable ensuite dans les produits, catégories, articles et sections
                      éditoriales.
                    </p>
                    <p>
                      Import limité à 10 MB, avec prise en charge des fichiers JPEG, PNG et WebP.
                    </p>
                  </div>

                  <AdminFormActions className="sm:justify-end lg:justify-start">
                    <Button className="sm:min-w-40" type="submit">
                      Importer le média
                    </Button>
                  </AdminFormActions>
                </div>
              </form>
            </AdminFormSection>
          </div>

        <AdminCollectionSection
          className="min-h-0 flex-1"
          contentClassName="min-h-0 flex-1 overflow-y-auto pr-1"
          description="Chaque image reste immédiatement réutilisable. Les informations techniques sont présentées comme des repères de contrôle, sans surcharger la lecture."
          eyebrow="Bibliothèque"
          title="Bibliothèque locale"
          variant="plain"
          meta={
            assets.length > 0 ? (
              <span className="inline-flex h-7 items-center rounded-full border border-border-soft bg-surface-panel-soft px-3 text-xs font-medium text-foreground">
                {assets.length} média{assets.length > 1 ? "s" : ""}
              </span>
            ) : null
          }
        >
          {assets.length > 0 ? (
            <div className="admin-media-grid grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
              {assets.map((asset) => (
                <AdminMediaAssetCard
                  key={asset.id}
                  asset={{
                    originalName: asset.originalName,
                    previewUrl: asset.previewUrl,
                    createdAtLabel: mediaDateFormatter.format(new Date(asset.createdAt)),
                    byteSizeLabel: formatByteSize(asset.byteSize),
                    dimensionsLabel: formatDimensions(asset),
                    mimeType: asset.mimeType,
                    filePath: asset.filePath,
                  }}
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState
              description="Importez une première image pour commencer votre bibliothèque."
              eyebrow="Aucun média"
              title="La bibliothèque est encore vide"
            />
          )}
        </AdminCollectionSection>
      </div>
    </AdminPageShell>
  );
}
