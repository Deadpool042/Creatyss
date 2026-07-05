import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Notice } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUploadsPublicPath } from "@/core/uploads";
import { BlogImagePickerField, requestBlogPostSeoSuggestionAction } from "@/features/admin/blog";
import { BlogSeoFieldsWithAi } from "@/features/admin/blog/components/blog-seo-fields-with-ai";
import { listSeoSuggestionHistory } from "@/features/ai-assistance/queries";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import { updateBlogPostAction } from "@/features/admin/blog/actions/update-blog-post-action";
import { BlogPostTranslationsForm } from "@/features/admin/blog/components/blog-post-translations-form";
import { getAdminBlogPostDetail } from "@/features/admin/blog/queries/get-admin-blog-post-detail.query";
import { listBlogPostTranslations } from "@/features/admin/blog/queries/list-blog-post-translations.query";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";
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

  const [
    post,
    assets,
    uploadsPublicPath,
    aiSuggestionEnabled,
    aiSuggestionHistoryEnabled,
    aiSuggestionAutomationEnabled,
    multilingualEnabled,
  ] = await Promise.all([
    getAdminBlogPostDetail({ postId: id }),
    listAdminMediaAssets(),
    Promise.resolve(getUploadsPublicPath()),
    meetsFeatureLevel("ai.core", "assistant"),
    meetsFeatureLevel("ai.core", "advanced"),
    meetsFeatureLevel("ai.core", "automation"),
    meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual"),
  ]);

  if (post === null) {
    notFound();
  }

  const translationsState = multilingualEnabled
    ? await listBlogPostTranslations({ postId: post.id })
    : null;

  const aiSuggestionHistory = aiSuggestionHistoryEnabled
    ? await listSeoSuggestionHistory({
        subjectType: "BLOG_POST",
        subjectId: post.id,
      })
    : [];

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Modifier l'article"
      navigation={{ label: "Retour", href: "/admin/content/blog" }}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu" },
        { label: "Blog", href: "/admin/content/blog" },
        { label: post.title },
      ]}
      contentPreset="form"
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Blog"
          title="Modifier l'article"
          description="Modification d'un article de blog."
        />
      }
    >
      <ContentRouteNav />
      {errorMessage !== null && <Notice tone="alert">{errorMessage}</Notice>}
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
            <Textarea
              id="blog-content"
              name="content"
              rows={10}
              defaultValue={post.content ?? ""}
            />
          </AdminFormField>

          <BlogSeoFieldsWithAi
            postId={post.id}
            defaultSeoTitle={post.seoTitle ?? ""}
            defaultSeoDescription={post.seoDescription ?? ""}
            aiSuggestionEnabled={aiSuggestionEnabled}
            aiSuggestionAutomationEnabled={aiSuggestionAutomationEnabled}
            aiSuggestionHistory={aiSuggestionHistory}
            aiSuggestionHistoryEnabled={aiSuggestionHistoryEnabled}
            aiSuggestionAction={requestBlogPostSeoSuggestionAction}
          />

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

      {translationsState !== null && translationsState.hasTargetLocale && (
        <AdminFormSection
          eyebrow="Localisation"
          title={`Traductions (${translationsState.targetLocaleName})`}
        >
          <BlogPostTranslationsForm
            postId={post.id}
            targetLocaleName={translationsState.targetLocaleName}
            fields={translationsState.fields}
          />
        </AdminFormSection>
      )}
    </AdminPageShell>
  );
}
