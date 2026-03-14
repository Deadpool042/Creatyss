import Link from "next/link";
import { listAdminMediaAssets } from "@/db/admin-media";
import { createBlogPostAction } from "@/features/admin/blog/actions";

export const dynamic = "force-dynamic";

type NewAdminBlogPostPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

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
    case "save_failed":
      return "L'article n'a pas pu être enregistré.";
    default:
      return null;
  }
}

export default async function NewAdminBlogPostPage({
  searchParams
}: NewAdminBlogPostPageProps) {
  const [resolvedSearchParams, mediaAssets] = await Promise.all([
    searchParams,
    listAdminMediaAssets()
  ]);
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);

  return (
    <section className="section admin-blog-form-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Blog</p>
          <h1>Nouvel article</h1>
          <p className="lead">
            Créez un article simple avec un texte, un statut et une image de
            couverture optionnelle.
          </p>
        </div>

        <Link className="link-subtle button" href="/admin/blog">
          Retour à la liste
        </Link>
      </div>

      {errorMessage ? (
        <p className="admin-alert" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <form action={createBlogPostAction} className="admin-form admin-blog-form">
        <label className="admin-field">
          <span className="meta-label">Titre</span>
          <input className="admin-input" name="title" required type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Slug</span>
          <input className="admin-input" name="slug" required type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Extrait</span>
          <textarea className="admin-input admin-textarea" name="excerpt" rows={4} />
        </label>

        <label className="admin-field">
          <span className="meta-label">Contenu</span>
          <textarea className="admin-input admin-textarea" name="content" rows={10} />
        </label>

        <label className="admin-field">
          <span className="meta-label">Titre SEO</span>
          <input className="admin-input" name="seoTitle" type="text" />
        </label>

        <label className="admin-field">
          <span className="meta-label">Description SEO</span>
          <textarea
            className="admin-input admin-textarea"
            name="seoDescription"
            rows={3}
          />
        </label>

        <label className="admin-field">
          <span className="meta-label">Statut</span>
          <select className="admin-input" defaultValue="draft" name="status">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </label>

        <label className="admin-field">
          <span className="meta-label">Image de couverture</span>
          <select
            className="admin-input"
            defaultValue=""
            name="coverImageMediaAssetId"
          >
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
            Créer l&apos;article
          </button>
        </div>
      </form>
    </section>
  );
}
