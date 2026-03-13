import { Button } from "@/components/ui/button";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import {
  getAdminHomepageEditorData,
  type AdminHomepageFeaturedBlogPostSelection,
  type AdminHomepageFeaturedCategorySelection,
  type AdminHomepageFeaturedProductSelection
} from "@/db/repositories/admin-homepage.repository";
import { listAdminMediaAssets } from "@/db/admin-media";
import { updateHomepageAction } from "@/features/admin/homepage/actions/update-homepage-action";
import { getUploadsPublicPath } from "@/lib/uploads";
import { EditorialSection } from "./editorial-section";
import { FeaturedBlogPostsSection } from "./featured-blog-posts-section";
import { FeaturedCategoriesSection } from "./featured-categories-section";
import { FeaturedProductsSection } from "./featured-products-section";
import { HeroSection } from "./hero-section";

export const dynamic = "force-dynamic";

type AdminHomepagePageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

function readSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Page d'accueil enregistrée avec succès.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_homepage":
      return "La page d'accueil publiée est introuvable.";
    case "invalid_hero_image":
      return "La sélection de l'image principale est invalide.";
    case "hero_media_missing":
      return "Le média sélectionné pour l'image principale est introuvable.";
    case "invalid_product_selection":
      return "La sélection des produits mis en avant est invalide.";
    case "invalid_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre unique.";
    case "product_missing":
      return "Au moins un produit mis en avant est introuvable ou n'est plus publié.";
    case "invalid_category_selection":
      return "La sélection des catégories mises en avant est invalide.";
    case "invalid_category_sort_order":
      return "Chaque catégorie mise en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_category_sort_order":
      return "Chaque catégorie mise en avant doit avoir un ordre unique.";
    case "category_missing":
      return "Au moins une catégorie mise en avant est introuvable.";
    case "invalid_blog_post_selection":
      return "La sélection des articles mis en avant est invalide.";
    case "invalid_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre unique.";
    case "blog_post_missing":
      return "Au moins un article mis en avant est introuvable ou n'est plus publié.";
    case "save_failed":
      return "La page d'accueil n'a pas pu être enregistrée.";
    default:
      return null;
  }
}

function buildSelectionMap<TSelection extends { sortOrder: number }>(
  selections: readonly TSelection[],
  getId: (selection: TSelection) => string
): Map<string, number> {
  return new Map(
    selections.map(selection => [getId(selection), selection.sortOrder])
  );
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

export default async function AdminHomepagePage({
  searchParams
}: AdminHomepagePageProps) {
  const [resolvedSearchParams, editorData, mediaAssets] = await Promise.all([
    searchParams,
    getAdminHomepageEditorData(),
    listAdminMediaAssets()
  ]);
  const successMessage = getStatusMessage(
    readSearchParam(resolvedSearchParams, "status")
  );
  const explicitErrorMessage = getErrorMessage(
    readSearchParam(resolvedSearchParams, "error")
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
  const productSelectionMap =
    buildSelectionMap<AdminHomepageFeaturedProductSelection>(
      homepage.featuredProducts,
      s => s.productId
    );
  const categorySelectionMap =
    buildSelectionMap<AdminHomepageFeaturedCategorySelection>(
      homepage.featuredCategories,
      s => s.categoryId
    );
  const blogPostSelectionMap =
    buildSelectionMap<AdminHomepageFeaturedBlogPostSelection>(
      homepage.featuredBlogPosts,
      s => s.blogPostId
    );
  const uploadsPublicPath = getUploadsPublicPath();
  const heroImageUrl = getImageUrl(uploadsPublicPath, homepage.heroImagePath);
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
