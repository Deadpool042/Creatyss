import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/notice";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { listAdminMediaAssets } from "@/db/admin-media";
import { createBlogPostAction } from "@/features/admin/blog";

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

export default async function NewAdminBlogPostPage({ searchParams }: NewAdminBlogPostPageProps) {
  const [resolvedSearchParams, mediaAssets] = await Promise.all([
    searchParams,
    listAdminMediaAssets(),
  ]);
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = getErrorMessage(errorParam);

  return (
    <AdminPageShell
      actions={
        <Button asChild size="sm" variant="outline">
          <Link href="/admin/blog">Retour à la liste</Link>
        </Button>
      }
      description="Renseignez le titre, le contenu et les informations de publication avant de créer l'article."
      eyebrow="Blog"
      title="Nouvel article"
    >
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      <AdminFormSection>
        <form action={createBlogPostAction} className="grid gap-4">
          <AdminFormField htmlFor="blog-title" label="Titre">
            <Input id="blog-title" name="title" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="blog-slug" label="Slug">
            <Input id="blog-slug" name="slug" required type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="blog-excerpt" label="Extrait">
            <Textarea id="blog-excerpt" name="excerpt" rows={4} />
          </AdminFormField>

          <AdminFormField htmlFor="blog-content" label="Contenu">
            <Textarea id="blog-content" name="content" rows={10} />
          </AdminFormField>

          <AdminFormField htmlFor="blog-seo-title" label="Titre SEO">
            <Input id="blog-seo-title" name="seoTitle" type="text" />
          </AdminFormField>

          <AdminFormField htmlFor="blog-seo-description" label="Description SEO">
            <Textarea id="blog-seo-description" name="seoDescription" rows={3} />
          </AdminFormField>

          <AdminFormField htmlFor="blog-status" label="Statut">
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue="draft"
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
              defaultValue=""
              id="blog-cover-image"
              name="coverImageMediaAssetId"
            >
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
            <Button type="submit">Créer l&apos;article</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
