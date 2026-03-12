import { access } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { listAdminMediaAssets, type AdminMediaAsset } from "@/db/admin-media";
import { requireAuthenticatedAdmin } from "@/lib/admin-auth";
import { uploadAdminMedia, MediaUploadError } from "@/features/admin/media/upload";
import { getUploadsDirectory, getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const mediaDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short"
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
      previewUrl: await resolvePreviewUrl(asset.filePath)
    }))
  );
}

async function uploadMediaAction(formData: FormData) {
  "use server";

  const admin = await requireAuthenticatedAdmin();

  try {
    await uploadAdminMedia({
      adminUserId: admin.id,
      file: formData.get("file")
    });
  } catch (error) {
    const errorCode =
      error instanceof MediaUploadError ? error.code : "upload_failed";

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
  const successMessage =
    statusParam === "uploaded" ? "Média importé avec succès." : null;
  const errorMessage = getErrorMessage(errorParam);
  const assets = await buildMediaListItems();

  return (
    <div className="admin-media-page">
      <section className="store-card admin-upload-card">
        <div className="stack">
          <p className="eyebrow">Bibliothèque médias</p>
          <h2>Importer une image</h2>
          <p className="card-copy">
            Formats acceptés : JPEG, PNG, WebP. Taille maximale : 10 MB.
          </p>
        </div>

        {successMessage ? <p className="admin-success">{successMessage}</p> : null}
        {errorMessage ? (
          <p className="admin-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form action={uploadMediaAction} className="admin-form">
          <label className="admin-field">
            <span className="meta-label">Image</span>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="admin-input"
              name="file"
              required
              type="file"
            />
          </label>

          <div>
            <button className="button" type="submit">
              Importer le média
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Médias</p>
            <h2>Bibliothèque locale</h2>
          </div>
        </div>

        {assets.length > 0 ? (
          <div className="admin-media-grid">
            {assets.map((asset) => (
              <article className="store-card admin-media-card" key={asset.id}>
                {asset.previewUrl ? (
                  <div className="admin-media-preview">
                    <img
                      alt={asset.originalName}
                      className="media-image"
                      loading="lazy"
                      src={asset.previewUrl}
                    />
                  </div>
                ) : (
                  <div className="admin-media-preview admin-media-placeholder">
                    Aperçu indisponible
                  </div>
                )}

                <div className="stack">
                  <p className="meta-label">Nom original</p>
                  <p className="card-copy">{asset.originalName}</p>
                </div>

                <div className="stack">
                  <p className="meta-label">Format du fichier</p>
                  <p className="card-copy">{asset.mimeType}</p>
                </div>

                <div className="stack">
                  <p className="meta-label">Taille</p>
                  <p className="card-copy">{formatByteSize(asset.byteSize)}</p>
                </div>

                <div className="stack">
                  <p className="meta-label">Dimensions</p>
                  <p className="card-copy">
                    {asset.imageWidth !== null && asset.imageHeight !== null
                      ? `${asset.imageWidth} × ${asset.imageHeight}`
                      : "Indisponibles"}
                  </p>
                </div>

                <div className="stack">
                  <p className="meta-label">Chemin</p>
                  <p className="card-copy">{asset.filePath}</p>
                </div>

                <div className="stack">
                  <p className="meta-label">Ajouté le</p>
                  <p className="card-copy">
                    {mediaDateFormatter.format(new Date(asset.createdAt))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucun média</p>
            <h2>La bibliothèque est encore vide</h2>
            <p className="card-copy">
              Les images importées depuis cet écran seront listées ici.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
