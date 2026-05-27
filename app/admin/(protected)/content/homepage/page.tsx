import type { HomepageStatus } from "@/prisma-generated/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/shared/feedback";
import { AdminFormActions } from "@/components/admin/forms";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { getUploadsPublicPath } from "@/core/uploads";
import {
  createHomepageAction,
  getAdminHomepageEditorData,
  publishHomepageAction,
  updateHomepageAction,
} from "@/features/admin/homepage";
import { listAdminMediaAssets } from "@/features/admin/media";
import {
  buildBlogPostSelectionMap,
  buildCategorySelectionMap,
  buildProductSelectionMap,
  getHomepageErrorMessage,
  getHomepageImageUrl,
  getHomepageStatusMessage,
  readHomepageSearchParam,
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

function getHomepageStatusPresentation(status: HomepageStatus): {
  label: string;
  badgeVariant: "outline" | "secondary";
} {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Publié",
        badgeVariant: "secondary",
      };
    case "DRAFT":
    default:
      return {
        label: "Brouillon",
        badgeVariant: "outline",
      };
  }
}

export default async function AdminHomepagePage({ searchParams }: AdminHomepagePageProps) {
  const [resolvedSearchParams, editorData, mediaAssets] = await Promise.all([
    searchParams,
    getAdminHomepageEditorData(),
    listAdminMediaAssets(),
  ]);

  const successMessage = getHomepageStatusMessage(
    readHomepageSearchParam(resolvedSearchParams, "status")
  );
  const explicitErrorMessage = getHomepageErrorMessage(
    readHomepageSearchParam(resolvedSearchParams, "error")
  );

  if (editorData === null) {
    return (
      <AdminPageShell
        description="Créez la page d'accueil initiale pour commencer son édition depuis l'administration."
        eyebrow="Accueil"
        scrollMode="area"
        title="Édition de la page d'accueil"
      >
        {explicitErrorMessage ? <Notice tone="alert">{explicitErrorMessage}</Notice> : null}
        <Notice tone="note">
          Aucune page d&apos;accueil n&apos;existe encore pour cette boutique. Vous pouvez créer la
          structure initiale sans intervention technique.
        </Notice>
        <form action={createHomepageAction} className="space-y-6">
          <AdminFormActions className="justify-start sm:justify-end">
            <Button className="w-full sm:w-auto" size="lg" type="submit">
              Créer la page d&apos;accueil
            </Button>
          </AdminFormActions>
        </form>
      </AdminPageShell>
    );
  }

  const { homepage, productOptions, categoryOptions, blogPostOptions } = editorData;
  const homepageStatus = getHomepageStatusPresentation(homepage.status);
  const productSelectionMap = buildProductSelectionMap(homepage.featuredProducts);
  const categorySelectionMap = buildCategorySelectionMap(homepage.featuredCategories);
  const blogPostSelectionMap = buildBlogPostSelectionMap(homepage.featuredBlogPosts);
  const uploadsPublicPath = getUploadsPublicPath();
  const heroImageUrl = getHomepageImageUrl(uploadsPublicPath, homepage.heroImagePath);
  const currentHeroMediaAsset =
    homepage.heroImagePath === null
      ? null
      : (mediaAssets.find((asset) => asset.filePath === homepage.heroImagePath) ?? null);
  const heroImageSelectValue =
    currentHeroMediaAsset?.id ?? (homepage.heroImagePath !== null ? "__keep_current__" : "");

  return (
    <AdminPageShell
      description="Commencez par la bannière principale, puis complétez le bloc éditorial et les sélections mises en avant."
      eyebrow="Accueil"
      scrollMode="area"
      title="Édition de la page d'accueil"
    >
      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {explicitErrorMessage ? <Notice tone="alert">{explicitErrorMessage}</Notice> : null}

      <div className="flex flex-col gap-2 rounded-3xl border border-border/70 bg-background/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Statut actuel</p>
          <div className="flex items-center gap-3">
            <Badge variant={homepageStatus.badgeVariant}>{homepageStatus.label}</Badge>
            {homepage.publishedAt ? (
              <span className="text-sm text-muted-foreground">
                Publiée le {homepage.publishedAt.toLocaleDateString("fr-FR")}
              </span>
            ) : null}
          </div>
        </div>
        {homepage.status === "DRAFT" ? (
          <div className="space-y-2 sm:text-right">
            <p className="text-sm text-muted-foreground">
              Enregistrez vos modifications avant de publier.
            </p>
            <form action={publishHomepageAction}>
              <input name="homepageId" type="hidden" value={homepage.id} />
              <Button className="w-full sm:w-auto" type="submit" variant="secondary">
                Publier la page d&apos;accueil
              </Button>
            </form>
          </div>
        ) : null}
      </div>

      <form action={updateHomepageAction} className="space-y-6">
        <input name="homepageId" type="hidden" value={homepage.id} />

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
          shippingReturnsPolicy={homepage.shippingReturnsPolicy}
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

        <AdminFormActions className="justify-start sm:justify-end">
          <Button className="w-full sm:w-auto" size="lg" type="submit">
            Enregistrer la page d&apos;accueil
          </Button>
        </AdminFormActions>
      </form>
    </AdminPageShell>
  );
}
