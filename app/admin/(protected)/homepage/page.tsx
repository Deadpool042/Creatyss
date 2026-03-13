import { Button } from "@/components/ui/button";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import {
  getAdminHomepageEditorData,
} from "@/db/repositories/admin-homepage.repository";
import { listAdminMediaAssets } from "@/db/admin-media";
import { updateHomepageAction } from "@/features/admin/homepage/actions/update-homepage-action";
import { getUploadsPublicPath } from "@/lib/uploads";
import {
  buildBlogPostSelectionMap,
  buildCategorySelectionMap,
  buildProductSelectionMap,
  getHomepageErrorMessage,
  getHomepageImageUrl,
  getHomepageStatusMessage,
  readHomepageSearchParam
} from "./homepage-page-helpers";
import { EditorialSection } from "./editorial-section";
import { FeaturedBlogPostsSection } from "./featured-blog-posts-section";
import { FeaturedCategoriesSection } from "./featured-categories-section";
import { FeaturedProductsSection } from "./featured-products-section";
import { HeroSection } from "./hero-section";

export const dynamic = "force-dynamic";

type AdminHomepagePageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function AdminHomepagePage({
  searchParams
}: AdminHomepagePageProps) {
  const [resolvedSearchParams, editorData, mediaAssets] = await Promise.all([
    searchParams,
    getAdminHomepageEditorData(),
    listAdminMediaAssets()
  ]);
  const successMessage = getHomepageStatusMessage(
    readHomepageSearchParam(resolvedSearchParams, "status")
  );
  const explicitErrorMessage = getHomepageErrorMessage(
    readHomepageSearchParam(resolvedSearchParams, "error")
  );

  if (editorData === null) {
    return (
      <section className="section admin-homepage-page">
        <PageHeader
          description={
            <>
              La page d'accueil ne peut pas être modifiée tant qu&apos;aucune
              version publiée n&apos;existe.
            </>
          }
          eyebrow="Accueil"
          title="Édition de la page d'accueil"
        />

        <Notice tone="alert">
          {explicitErrorMessage ?? "La page d'accueil publiée est introuvable."}
        </Notice>
      </section>
    );
  }

  const { homepage, productOptions, categoryOptions, blogPostOptions } =
    editorData;
  const productSelectionMap = buildProductSelectionMap(homepage.featuredProducts);
  const categorySelectionMap = buildCategorySelectionMap(
    homepage.featuredCategories
  );
  const blogPostSelectionMap = buildBlogPostSelectionMap(
    homepage.featuredBlogPosts
  );
  const uploadsPublicPath = getUploadsPublicPath();
  const heroImageUrl = getHomepageImageUrl(
    uploadsPublicPath,
    homepage.heroImagePath
  );
  const currentHeroMediaAsset =
    homepage.heroImagePath === null
      ? null
      : (mediaAssets.find(asset => asset.filePath === homepage.heroImagePath) ??
        null);
  const heroImageSelectValue =
    currentHeroMediaAsset?.id ??
    (homepage.heroImagePath !== null ? "__keep_current__" : "");

  return (
    <section className="section admin-homepage-page">
      <PageHeader
        description={
          <>
            Commencez par la bannière principale, puis complétez le bloc
            éditorial et les sélections mises en avant.
          </>
        }
        eyebrow="Accueil"
        title="Édition de la page d'accueil"
      />

      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {explicitErrorMessage ? (
        <Notice tone="alert">{explicitErrorMessage}</Notice>
      ) : null}

      <form
        action={updateHomepageAction}
        className="admin-form admin-homepage-form">
        <input
          name="homepageId"
          type="hidden"
          value={homepage.id}
        />
        <input
          name="currentHeroImagePath"
          type="hidden"
          value={homepage.heroImagePath ?? ""}
        />

        <HeroSection
          currentHeroMediaAsset={currentHeroMediaAsset}
          heroImagePath={homepage.heroImagePath}
          heroImageSelectValue={heroImageSelectValue}
          heroImageUrl={heroImageUrl}
          heroText={homepage.heroText}
          heroTitle={homepage.heroTitle}
          mediaAssets={mediaAssets}
        />

        <EditorialSection
          editorialText={homepage.editorialText}
          editorialTitle={homepage.editorialTitle}
        />

        <FeaturedProductsSection
          productOptions={productOptions}
          productSelectionMap={productSelectionMap}
        />

        <FeaturedCategoriesSection
          categoryOptions={categoryOptions}
          categorySelectionMap={categorySelectionMap}
        />

        <FeaturedBlogPostsSection
          blogPostOptions={blogPostOptions}
          blogPostSelectionMap={blogPostSelectionMap}
        />

        <AdminFormActions>
          <Button
            className="button"
            type="submit">
            Enregistrer la page d&apos;accueil
          </Button>
        </AdminFormActions>
      </form>
    </section>
  );
}
