import { access } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/shared/notice";
import { SectionIntro } from "@/components/shared/section-intro";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { listAdminMediaAssets, type AdminMediaAsset } from "@/db/repositories/admin-media.repository";
import { requireAuthenticatedAdmin } from "@/lib/admin-auth";
import { uploadAdminMedia, MediaUploadError } from "@/features/admin/media";
import { getUploadsDirectory, getUploadsPublicPath } from "@/lib/uploads";
import { Card } from "@/components/ui/card";

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

type AdminMediaListItem = AdminMediaAsset & {
  previewUrl: string | null;
};

function formatByteSize(byteSize: string): string {
  const value = Number(byteSize);

  if (!Number.isFinite(value) || value <= 0) {
    return `${byteSize} o`;
  }

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${value} o`;
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

function normalizeRelativeMediaPath(filePath: string): string | null {
  const trimmedPath = filePath.trim().replace(/^\/+/, "");

  if (trimmedPath.length === 0) {
    return null;
  }

  return trimmedPath.replaceAll("\\", "/");
}

async function resolvePreviewUrl(filePath: string): Promise<string | null> {
  const normalizedPath = normalizeRelativeMediaPath(filePath);

  if (normalizedPath === null) {
    return null;
  }

  const uploadsDirectory = getUploadsDirectory();
  const absolutePath = path.resolve(uploadsDirectory, normalizedPath);
  const relativePath = path.relative(uploadsDirectory, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  try {
    await access(absolutePath);
  } catch {
    return null;
  }

  return `${getUploadsPublicPath()}/${normalizedPath}`;
}

async function buildMediaListItems(): Promise<AdminMediaListItem[]> {
  const assets = await listAdminMediaAssets();

  return Promise.all(
    assets.map(async (asset) => ({
      ...asset,
      previewUrl: await resolvePreviewUrl(asset.filePath),
    }))
  );
}

async function uploadMediaAction(formData: FormData) {
  "use server";

  const admin = await requireAuthenticatedAdmin();

  try {
    await uploadAdminMedia({
      adminUserId: admin.id,
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
  const assets = await buildMediaListItems();

  return (
    <AdminPageShell
      description="Importez d'abord vos visuels, puis réutilisez-les dans les produits, le blog et la page d'accueil."
      eyebrow="Médias"
      title="Bibliothèque médias"
    >
      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <AdminFormSection
        description="Ajoutez ici une image prête à être réutilisée. Formats acceptés : JPEG, PNG, WebP. Taille maximale : 10 MB."
        eyebrow="Import"
        title="Importer une image"
      >
        <form action={uploadMediaAction} className="grid gap-4">
          <AdminFormField htmlFor="media-file" label="Image">
            <Input
              accept="image/jpeg,image/png,image/webp"
              id="media-file"
              name="file"
              required
              type="file"
            />
          </AdminFormField>

          <AdminFormActions>
            <Button type="submit">Importer le média</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>

      <div className="grid gap-4">
        <SectionIntro
          className="grid gap-2"
          description="Chaque image reste immédiatement réutilisable. Les informations techniques sont affichées en dessous pour vérification."
          eyebrow="Médias"
          title="Bibliothèque locale"
          titleAs="h2"
        />

        {assets.length > 0 ? (
          <div className="admin-media-grid grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
            {assets.map((asset) => (
              <Card key={asset.id} className="grid content-start gap-3 p-5">
                {asset.previewUrl ? (
                  <div className="min-h-48 overflow-hidden rounded-xl bg-muted/20">
                    <Image
                      alt={asset.originalName}
                      className="block w-full object-cover"
                      loading="lazy"
                      src={asset.previewUrl}
                      width={400}
                      height={300}
                    />
                  </div>
                ) : (
                  <div className="grid min-h-48 place-items-center rounded-xl bg-muted/20 p-4 text-center text-sm text-muted-foreground">
                    Aperçu indisponible
                  </div>
                )}

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Nom original
                  </p>
                  <p className="text-sm text-foreground">{asset.originalName}</p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Ajouté le
                  </p>
                  <p className="text-sm text-foreground">
                    {mediaDateFormatter.format(new Date(asset.createdAt))}
                  </p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Taille
                  </p>
                  <p className="text-sm text-foreground">{formatByteSize(asset.byteSize)}</p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Dimensions
                  </p>
                  <p className="text-sm text-foreground">
                    {asset.imageWidth !== null && asset.imageHeight !== null
                      ? `${asset.imageWidth} × ${asset.imageHeight}`
                      : "Indisponibles"}
                  </p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Format du fichier
                  </p>
                  <p className="text-sm text-foreground">{asset.mimeType}</p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Chemin
                  </p>
                  <p className="break-all text-sm text-foreground">{asset.filePath}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            description="Importez une première image pour commencer votre bibliothèque."
            eyebrow="Aucun média"
            title="La bibliothèque est encore vide"
          />
        )}
      </div>
    </AdminPageShell>
  );
}
