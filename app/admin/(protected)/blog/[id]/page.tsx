import Image from "next/image";
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
import { findAdminBlogPostById } from "@/db/repositories/admin-blog.repository";
import { deleteBlogPostAction, updateBlogPostAction } from "@/features/admin/blog";
import { getBlogPostPublishability } from "@/entities/blog/blog-post-publishability";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const blogDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
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
    case "cannot_publish_missing_content":
      return "Le contenu de l'article est obligatoire pour publier. Renseignez-le avant de passer en publié.";
    case "save_failed":
      return "L'article n'a pas pu être mis à jour.";
    case "delete_failed":
      return "L'article n'a pas pu être supprimé.";
    default:
      return null;
  }
}

function getImageUrl(uploadsPublicPath: string, filePath: string | null): string | null {
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
  searchParams,
}: EditAdminBlogPostPageProps) {
  const { id } = await params;
  const blogPost = await findAdminBlogPostById(id);

  if (blogPost === null) {
    notFound();
  }

  const [resolvedSearchParams, mediaAssets] = await Promise.all([
    searchParams,
    listAdminMediaAssets(),
  ]);
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const publishabilityWarning =
    blogPost.status === "draft" ? getBlogPostPublishability({ content: blogPost.content }) : null;
  const uploadsPublicPath = getUploadsPublicPath();
  const coverImageUrl = getImageUrl(uploadsPublicPath, blogPost.coverImagePath);
  const currentCoverMediaAsset =
    blogPost.coverImagePath === null
      ? null
      : (mediaAssets.find((asset) => asset.filePath === blogPost.coverImagePath) ?? null);
  const coverImageSelectValue =
    currentCoverMediaAsset?.id ?? (blogPost.coverImagePath !== null ? "__keep_current__" : "");

  return (
    <AdminPageShell
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/blog">Retour à la liste</Link>
        </Button>
      }
      description="Modifiez d'abord le contenu et le statut de l'article, puis ajustez sa couverture si nécessaire."
      eyebrow="Blog"
      title="Modifier l'article"
    >
      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}
      {publishabilityWarning !== null && !publishabilityWarning.ok ? (
        <Notice tone="alert">
          Le contenu de l&apos;article est vide. Renseignez-le pour pouvoir publier cet article.
        </Notice>
      ) : null}

      <AdminFormSection>
        <form action={updateBlogPostAction} className="grid gap-4">
          <input name="blogPostId" type="hidden" value={blogPost.id} />
          <input name="currentCoverImagePath" type="hidden" value={blogPost.coverImagePath ?? ""} />

          <p className="text-sm leading-relaxed text-muted-foreground">
            {blogPost.publishedAt
              ? `Publié le ${blogDateTimeFormatter.format(new Date(blogPost.publishedAt))}`
              : "Cet article est enregistré en brouillon pour le moment."}
          </p>

          {coverImageUrl ? (
            <div className="min-h-56 overflow-hidden rounded-xl bg-muted/20">
              <Image
                alt={blogPost.title}
                className="block w-full object-cover"
                src={coverImageUrl}
                width={900}
                height={500}
              />
            </div>
          ) : (
            <div className="grid min-h-56 place-items-center rounded-xl bg-muted/20 p-4 text-center text-sm text-muted-foreground">
              Aucune image de couverture actuellement
            </div>
          )}

          <AdminFormField htmlFor="blog-title" label="Titre">
            <Input
              defaultValue={blogPost.title}
              id="blog-title"
              name="title"
              required
              type="text"
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-slug" label="Slug">
            <Input defaultValue={blogPost.slug} id="blog-slug" name="slug" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="blog-excerpt" label="Extrait">
            <Textarea
              defaultValue={blogPost.excerpt ?? ""}
              id="blog-excerpt"
              name="excerpt"
              rows={4}
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-content" label="Contenu">
            <Textarea
              defaultValue={blogPost.content ?? ""}
              id="blog-content"
              name="content"
              rows={10}
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-seo-title" label="Titre SEO">
            <Input
              defaultValue={blogPost.seoTitle ?? ""}
              id="blog-seo-title"
              name="seoTitle"
              type="text"
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-seo-description" label="Description SEO">
            <Textarea
              defaultValue={blogPost.seoDescription ?? ""}
              id="blog-seo-description"
              name="seoDescription"
              rows={3}
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-status" label="Statut">
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={blogPost.status}
              id="blog-status"
              name="status"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </AdminFormField>

          <AdminFormField htmlFor="blog-cover-image" label="Image de couverture">
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={coverImageSelectValue}
              id="blog-cover-image"
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
          </AdminFormField>

          {mediaAssets.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aucun média n&apos;est disponible. Vous pouvez en importer depuis{" "}
              <Link
                className="font-medium underline underline-offset-4 transition-colors hover:text-foreground"
                href="/admin/media"
              >
                la bibliothèque médias
              </Link>
              .
            </p>
          ) : null}

          <AdminFormActions>
            <Button type="submit">Enregistrer les modifications</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>

      <AdminFormSection
        description="La suppression retire l'article du blog public. Vérifiez ensuite vos mises en avant sur la page d'accueil si besoin."
        eyebrow="Suppression"
        title="Supprimer cet article"
      >
        <form action={deleteBlogPostAction}>
          <input name="blogPostId" type="hidden" value={blogPost.id} />

          <Button type="submit" variant="destructive">
            Supprimer l&apos;article
          </Button>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
