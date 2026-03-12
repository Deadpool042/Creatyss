import Link from "next/link";
import { notFound } from "next/navigation";
import { listAdminMediaAssets } from "@/db/admin-media";
import { findAdminBlogPostById } from "@/db/repositories/admin-blog.repository";
import { deleteBlogPostAction } from "@/features/admin/blog/actions/delete-blog-post-action";
import { updateBlogPostAction } from "@/features/admin/blog/actions/update-blog-post-action";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const blogDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

type EditAdminBlogPostPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Article créé avec succès.";
    case "updated":
      return "Article mis à jour avec succès.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_title":
      return "Le titre est obligatoire.";
    case "missing_slug":
      return "Le slug est obligatoire.";
    case "invalid_slug":
      return "Renseignez un slug valide.";
    case "invalid_status":
      return "Le statut de l'article est invalide.";
    case "invalid_cover_image":
      return "La sélection de l'image de couverture est invalide.";
    case "cover_media_missing":
      return "Le média sélectionné pour la couverture est introuvable.";
    case "slug_taken":
      return "Ce slug est déjà utilisé par un autre article.";
    case "referenced":
      return "Cet article ne peut pas être supprimé car il est encore référencé ailleurs.";
    case "save_failed":
      return "L'article n'a pas pu être mis à jour.";
    case "delete_failed":
      return "L'article n'a pas pu être supprimé.";
    default:
      return null;
  }
}

function getImageUrl(
  uploadsPublicPath: string,
  filePath: string | null
): string | null {
  if (typeof filePath !== "string") {
    return null;
  }

  const normalizedFilePath = filePath.trim().replace(/^\/+/, "");

  if (normalizedFilePath.length === 0) {
    return null;
  }

  return `${uploadsPublicPath}/${normalizedFilePath}`;
}

export default async function EditAdminBlogPostPage({
  params,
  searchParams
}: EditAdminBlogPostPageProps) {
  const { id } = await params;
  const blogPost = await findAdminBlogPostById(id);

  if (blogPost === null) {
    notFound();
  }

  const [resolvedSearchParams, mediaAssets] = await Promise.all([
    searchParams,
    listAdminMediaAssets()
  ]);
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const uploadsPublicPath = getUploadsPublicPath();
  const coverImageUrl = getImageUrl(uploadsPublicPath, blogPost.coverImagePath);
  const currentCoverMediaAsset =
    blogPost.coverImagePath === null
      ? null
      : mediaAssets.find((asset) => asset.filePath === blogPost.coverImagePath) ??
        null;
  const coverImageSelectValue =
    currentCoverMediaAsset?.id ??
    (blogPost.coverImagePath !== null ? "__keep_current__" : "");

  return (
    <div className="admin-blog-page">
      <section className="section admin-blog-form-section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Blog</p>
            <h1>Modifier l&apos;article</h1>
            <p className="lead">
              Modifiez d&apos;abord le contenu et le statut de l&apos;article,
              puis ajustez sa couverture si nécessaire.
            </p>
          </div>

          <Link className="link-subtle button" href="/admin/blog">
            Retour à la liste
          </Link>
        </div>

        {successMessage ? <p className="admin-success">{successMessage}</p> : null}
        {errorMessage ? (
          <p className="admin-alert" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form action={updateBlogPostAction} className="admin-form admin-blog-form">
          <input name="blogPostId" type="hidden" value={blogPost.id} />
          <input
            name="currentCoverImagePath"
            type="hidden"
            value={blogPost.coverImagePath ?? ""}
          />

          {blogPost.publishedAt ? (
            <p className="admin-muted-note">
              Publié le {blogDateTimeFormatter.format(new Date(blogPost.publishedAt))}
            </p>
          ) : (
            <p className="admin-muted-note">
              Cet article est enregistré en brouillon pour le moment.
            </p>
          )}

          {coverImageUrl ? (
            <div className="admin-blog-cover-preview">
              <img alt={blogPost.title} src={coverImageUrl} />
            </div>
          ) : (
            <div className="admin-blog-cover-preview admin-image-placeholder">
              Aucune image de couverture actuellement
            </div>
          )}

          <label className="admin-field">
            <span className="meta-label">Titre</span>
            <input
              className="admin-input"
              defaultValue={blogPost.title}
              name="title"
              required
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Slug</span>
            <input
              className="admin-input"
              defaultValue={blogPost.slug}
              name="slug"
              required
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Extrait</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={blogPost.excerpt ?? ""}
              name="excerpt"
              rows={4}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Contenu</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={blogPost.content ?? ""}
              name="content"
              rows={10}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Titre SEO</span>
            <input
              className="admin-input"
              defaultValue={blogPost.seoTitle ?? ""}
              name="seoTitle"
              type="text"
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Description SEO</span>
            <textarea
              className="admin-input admin-textarea"
              defaultValue={blogPost.seoDescription ?? ""}
              name="seoDescription"
              rows={3}
            />
          </label>

          <label className="admin-field">
            <span className="meta-label">Statut</span>
            <select
              className="admin-input"
              defaultValue={blogPost.status}
              name="status"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </label>

          <label className="admin-field">
            <span className="meta-label">Image de couverture</span>
            <select
              className="admin-input"
              defaultValue={coverImageSelectValue}
              name="coverImageMediaAssetId"
            >
              {blogPost.coverImagePath !== null && currentCoverMediaAsset === null ? (
                <option value="__keep_current__">
                  Conserver l&apos;image actuelle ({blogPost.coverImagePath})
                </option>
              ) : null}
              <option value="">Aucune image de couverture</option>
              {mediaAssets.map((mediaAsset) => (
                <option key={mediaAsset.id} value={mediaAsset.id}>
                  {mediaAsset.originalName} · {mediaAsset.mimeType}
                </option>
              ))}
            </select>
          </label>

          {mediaAssets.length === 0 ? (
            <p className="admin-muted-note">
              Aucun média n&apos;est disponible. Vous pouvez en importer depuis{" "}
              <Link className="link" href="/admin/media">
                la bibliothèque médias
              </Link>
              .
            </p>
          ) : null}

          <div className="admin-actions">
            <button className="button" type="submit">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </section>

      <section className="section admin-danger-zone">
        <div className="stack">
          <p className="eyebrow">Suppression</p>
          <h2>Supprimer cet article</h2>
          <p className="card-copy">
            La suppression retire l&apos;article du blog public. Vérifiez
            ensuite vos mises en avant sur la page d&apos;accueil si besoin.
          </p>
        </div>

        <form action={deleteBlogPostAction}>
          <input name="blogPostId" type="hidden" value={blogPost.id} />

          <button className="button admin-danger-button" type="submit">
            Supprimer l&apos;article
          </button>
        </form>
      </section>
    </div>
  );
}
