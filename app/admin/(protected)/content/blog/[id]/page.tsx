import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
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

type EditAdminBlogPostPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function EditAdminBlogPostPage({
  params,
}: EditAdminBlogPostPageProps) {
  const { id } = await params;
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
      pageTitleNavigation={{ label: "Retour", href: "/admin/content/blog" }}
      description="Modification d'un article de blog."
      eyebrow="Blog"
      title="Modifier l'article"
    >
      <AdminFormSection>
        <form action={handleUpdateBlogPost} className="grid gap-4">
          <input type="hidden" name="postId" value={post.id} />

          <AdminFormField htmlFor="blog-title" label="Titre">
            <Input id="blog-title" name="title" required type="text" defaultValue={post.title} />
          </AdminFormField>

          <AdminFormField htmlFor="blog-slug" label="Slug">
            <Input id="blog-slug" name="slug" required type="text" defaultValue={post.slug} />
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
