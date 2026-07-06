import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import {
  attachProductImagesAction,
  deleteProductAction,
  deleteProductImageAction,
  generateMissingProductImageAltTextsAction,
  reorderProductImageAction,
  setProductPrimaryImageAction,
  updateProductImageAltTextAction,
  uploadProductImagesAction,
} from "@/features/admin/products/editor/actions";
import {
  listAttachableMediaAssets,
  readAdminProductImages,
  readAdminProductPageContextBySlug,
} from "@/features/admin/products/editor/queries";
import {
  ProductArchivedActions,
  ProductArchivedBanner,
} from "@/features/admin/products/components/editor/product-archived-actions";
import { ProductImagesTab } from "@/features/admin/products/components/editor/product-images-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";
import {
  getProductModulePageShellProps,
  PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME,
} from "@/features/admin/products/components/shared/product-module-page-shell";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_EDITOR_NAV_COPY,
} from "@/features/admin/products/config";
import {
  ADMIN_PRODUCTS_CREATE_PATH,
  ADMIN_PRODUCTS_LIST_PATH,
  ADMIN_PRODUCTS_TRASH_PATH,
  buildAdminProductBreadcrumbs,
} from "@/features/admin/products/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailMediaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await readAdminProductPageContextBySlug(slug);

  if (product === null) {
    notFound();
  }

  if (product.isArchived) {
    return (
      <AdminPageShell
        title={product.name}
        navigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: ADMIN_PRODUCTS_LIST_PATH }}
        topbarAction={
          <ProductEditorTopbarMenu productId={product.id} productSlug={product.slug} isArchived />
        }
        scrollBehavior="page"
        contentPreset="detail"
        breadcrumbs={buildAdminProductBreadcrumbs(product.name)}
        header={
          <AdminPageHeader
            className="hidden lg:block"
            compact
            hideDescriptionOnMobile
            eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
            title={product.name}
            description="Produit archivé."
            actions={
              <div className="hidden lg:flex lg:items-center lg:gap-2">
                <ProductArchivedActions productSlug={product.slug} />
              </div>
            }
          />
        }
      >
        <div className={PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME}>
          <ProductArchivedBanner />

          <div className="mx-auto grid max-w-5xl gap-6 px-4 md:px-6 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start xl:px-0">
            <section className="overflow-hidden rounded-[1.85rem] border border-surface-border bg-card px-6 py-7 shadow-card md:px-8">
              <div className="grid gap-1.5">
                <ProductSectionEyebrow>Medias verrouillés</ProductSectionEyebrow>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Ce module reste en lecture seule tant que le produit est archivé.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Restaurez le produit pour reprendre la gestion de la galerie, de l’image
                  principale et des textes alternatifs.
                </p>
              </div>

              <div className="mt-6">
                <Button asChild variant="outline" size="sm" className="rounded-full px-5">
                  <Link href={ADMIN_PRODUCTS_TRASH_PATH}>Retour à la corbeille</Link>
                </Button>
              </div>
            </section>

            <aside className="xl:sticky xl:top-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-surface-border bg-surface-panel shadow-soft">
                <div className="grid gap-4 px-5 py-5">
                  <ProductSectionEyebrow>Actions</ProductSectionEyebrow>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Réactivez d’abord le produit avant d’ajouter de nouveaux médias ou de revoir sa
                    galerie.
                  </p>
                  <div className="lg:hidden">
                    <ProductArchivedActions productSlug={product.slug} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  const [
    imagesData,
    attachableMediaData,
    showMediaOptimizationDiagnostics,
    showMediaGenerationTools,
    showMediaAutomationTools,
  ] = await Promise.all([
    readAdminProductImages(product.id),
    listAttachableMediaAssets(product.id),
    meetsFeatureLevel("catalog.products.media", "optimization"),
    meetsFeatureLevel("catalog.products.media", "generation"),
    meetsFeatureLevel("catalog.products.media", "automation"),
  ]);

  if (imagesData === null) {
    notFound();
  }

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product,
        topbarAction: (
          <ProductEditorTopbarMenu
            productId={product.id}
            productSlug={product.slug}
            onDelete={deleteProductAction}
          />
        ),
        headerActions: (
          <Button asChild size="sm" className="lg:min-w-40">
            <Link href={ADMIN_PRODUCTS_CREATE_PATH}>
              {PRODUCT_CREATE_PAGE_COPY.newProductButton}
            </Link>
          </Button>
        ),
      })}
    >
      <div className={PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME}>
        <div className="mx-auto max-w-6xl px-4 md:px-6 xl:px-0">
          <div className="grid gap-1.5 border-b border-surface-border/80 pb-4">
            <ProductSectionEyebrow>Bibliothèque produit</ProductSectionEyebrow>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Gérez la galerie sans bruit visuel: ordre, image principale, textes alternatifs et
              rattachement depuis la médiathèque.
            </p>
          </div>
        </div>

        <ProductImagesTab
          productId={product.id}
          productSlug={product.slug}
          images={imagesData.images}
          attachableMediaItems={attachableMediaData.items}
          setPrimaryImageAction={setProductPrimaryImageAction}
          uploadImagesAction={uploadProductImagesAction}
          deleteImageAction={deleteProductImageAction}
          updateAltTextAction={updateProductImageAltTextAction}
          generateMissingAltTextAction={generateMissingProductImageAltTextsAction}
          reorderImageAction={reorderProductImageAction}
          attachImagesAction={attachProductImagesAction}
          showMediaOptimizationDiagnostics={showMediaOptimizationDiagnostics}
          showMediaGenerationTools={showMediaGenerationTools}
          showMediaAutomationTools={showMediaAutomationTools}
        />
      </div>
    </AdminPageShell>
  );
}
