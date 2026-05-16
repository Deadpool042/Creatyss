import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUploadsPublicPath } from "@/core/uploads";
import { BlogImagePickerField } from "@/features/admin/blog";
import { createBlogPostAction } from "@/features/admin/blog/actions/create-blog-post-action";
import { listAdminMediaAssets } from "@/features/admin/media";

async function handleCreateBlogPost(formData: FormData): Promise<void> {
  "use server";
  await createBlogPostAction(formData);
}

export default async function NewAdminBlogPostPage() {
  const [assets, uploadsPublicPath] = await Promise.all([
    listAdminMediaAssets(),
    Promise.resolve(getUploadsPublicPath()),
  ]);

  return (
    <AdminPageShell
      pageTitleNavigation={{ label: "Retour", href: "/admin/content/blog" }}
      description="Création d'un article de blog."
      eyebrow="Blog"
      title="Nouvel article"
    >
      <AdminFormSection>
        <form action={handleCreateBlogPost} className="grid gap-4">
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

          <input type="hidden" name="status" value="draft" />

          <BlogImagePickerField
            name="primaryImagePath"
            label="Image principale"
            defaultValue={null}
            assets={assets}
            uploadsPublicPath={uploadsPublicPath}
          />

          <BlogImagePickerField
            name="coverImagePath"
            label="Image de couverture"
            defaultValue={null}
            assets={assets}
            uploadsPublicPath={uploadsPublicPath}
          />

          <AdminFormActions>
            <Button type="submit">Créer</Button>
          </AdminFormActions>
        </form>
      </AdminFormSection>
    </AdminPageShell>
  );
}
