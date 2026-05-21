import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Notice } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUploadsPublicPath } from "@/core/uploads";
import { BlogImagePickerField } from "@/features/admin/blog";
import { updateBlogPostAction } from "@/features/admin/blog/actions/update-blog-post-action";
import { getAdminBlogPostDetail } from "@/features/admin/blog/queries/get-admin-blog-post-detail.query";
import { listAdminMediaAssets } from "@/features/admin/media";

async function handleUpdateBlogPost(formData: FormData): Promise<void> {
  "use server";
  await updateBlogPostAction(formData);
}

const ERROR_MESSAGES: Record<string, string> = {
  validation: "Les données saisies sont invalides. Vérifiez les champs et réessayez.",
  slug_taken: "Cette adresse d'article est déjà utilisée. Choisissez une adresse différente.",
};

type EditAdminBlogPostPageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
}>;

export default async function EditAdminBlogPostPage({
  params,
  searchParams,
}: EditAdminBlogPostPageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const errorCode = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const errorMessage = errorCode !== undefined ? (ERROR_MESSAGES[errorCode] ?? null) : null;

  const [post, assets, uploadsPublicPath] = await Promise.all([
    getAdminBlogPostDetail({ postId: id }),
    listAdminMediaAssets(),
    Promise.resolve(getUploadsPublicPath()),
  ]);

  if (post === null) {
    notFound();
  }

  return (
    <AdminPageShell
      scrollMode="area"
      pageTitleNavigation={{ label: "Retour", href: "/admin/content/blog" }}
      description="Modification d'un article de blog."
      eyebrow="Blog"
      title="Modifier l'article"
    >
      {errorMessage !== null && (
        <Notice tone="alert">{errorMessage}</Notice>
      )}
      <AdminFormSection>
        <form action={handleUpdateBlogPost} className="grid gap-4">
          <input type="hidden" name="postId" value={post.id} />

          <AdminFormField htmlFor="blog-title" label="Titre">
            <Input id="blog-title" name="title" required type="text" defaultValue={post.title} />
          </AdminFormField>

          <AdminFormField
            htmlFor="blog-slug"
            label="Adresse de l'article"
            description="Visible dans l'URL. Utilisez des lettres minuscules, des chiffres et des tirets."
          >
            <Input
              id="blog-slug"
              name="slug"
              required
              type="text"
              defaultValue={post.slug}
              placeholder="naissance-d-un-sac-unique"
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-excerpt" label="Extrait">
            <Textarea id="blog-excerpt" name="excerpt" rows={4} defaultValue={post.excerpt ?? ""} />
          </AdminFormField>

          <AdminFormField htmlFor="blog-content" label="Contenu">
            <Textarea id="blog-content" name="content" rows={10} defaultValue={post.content ?? ""} />
          </AdminFormField>

          <AdminFormField htmlFor="blog-seo-title" label="Titre SEO">
            <Input
              id="blog-seo-title"
              name="seoTitle"
              type="text"
              defaultValue={post.seoTitle ?? ""}
            />
          </AdminFormField>

          <AdminFormField htmlFor="blog-seo-description" label="Description SEO">
            <Textarea
              id="blog-seo-description"
              name="seoDescription"
              rows={3}
              defaultValue={post.seoDescription ?? ""}
            />
          </AdminFormField>

          <input type="hidden" name="status" value={post.status} />

          <BlogImagePickerField
            name="primaryImagePath"
            label="Image principale"
            defaultValue={post.primaryImagePath ?? null}
            assets={assets}
            uploadsPublicPath={uploadsPublicPath}
          />

          <BlogImagePickerField
            name="coverImagePath"
            label="Image de couverture"
            defaultValue={post.coverImagePath ?? null}
            assets={assets}
            uploadsPublicPath={uploadsPublicPath}
          />

          <AdminFormActions>
            <Button type="submit">Enregistrer</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
