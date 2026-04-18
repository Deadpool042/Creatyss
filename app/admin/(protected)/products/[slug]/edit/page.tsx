import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Button } from "@/components/ui/button";
import {
  attachProductImagesAction,
  createProductVariantAction,
  deleteProductAction,
  deleteProductImageAction,
  deleteProductVariantAction,
  listAdminProductCategoryOptions,
  listAdminRelatedProductOptions,
  listAdminProductTypeOptions,
  listAttachableMediaAssets,
  readAdminPriceLists,
  readAdminProductEditorBySlug,
  readAdminProductImages,
  readAdminProductPrices,
  readAdminProductTypeWithOptions,
  readAdminProductVariants,
  reorderProductImageAction,
  setDefaultProductVariantAction,
  setProductPrimaryImageAction,
  updateProductAvailabilityAction,
  updateProductCategoriesAction,
  updateProductGeneralAction,
  updateProductImageAltTextAction,
  updateProductInventoryAction,
  updateProductPricesAction,
  updateProductRelatedProductsAction,
  updateProductSeoAction,
  updateProductVariantAction,
  uploadProductImagesAction,
} from "@/features/admin/products/editor";
import {
  ProductArchivedActions,
  ProductArchivedBanner,
  ProductEditorPanel,
  ProductEditorTopbarMenu,
} from "@/features/admin/products/components";
import { DeleteProductButton } from "@/features/admin/products/components/editor";

export default async function ProductEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [editor, availableCategories, priceLists, productTypeOptions] = await Promise.all([
    readAdminProductEditorBySlug(slug),
    listAdminProductCategoryOptions(),
    readAdminPriceLists(),
    listAdminProductTypeOptions(),
  ]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Produit introuvable.
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link className="inline-flex items-center gap-2" href="/admin/products">
            Retour à la liste des produits
          </Link>
        </Button>
      </div>
    );
  }

  if (editor.product.isArchived) {
    return (
      <AdminPageShell
        title={editor.product.name}
        eyebrow="Produits"
        description="Produit archivé."
        viewportClassName="!h-full"
        navigation={{ label: "Produits", href: "/admin/products" }}
        breadcrumbs={[
          { label: "Accueil", href: "/admin" },
          { label: "Produits", href: "/admin/products" },
          { label: editor.product.name },
        ]}
        topbarAction={
          <ProductEditorTopbarMenu
            productId={editor.product.id}
            productSlug={editor.product.slug}
            isArchived
          />
        }
        contentClassName="lg:px-6 lg:pb-6"
        actions={
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <ProductArchivedActions productSlug={editor.product.slug} />
          </div>
        }
        headerDensity="compact"
        compactMobileTitle
        hideDescriptionOnMobile
        headerVisibility="desktop"
      >
        <div className="space-y-4">
          <ProductArchivedBanner />

          <div className="rounded-2xl border border-surface-border bg-card p-4 shadow-card lg:hidden">
            <ProductArchivedActions productSlug={editor.product.slug} />
          </div>

          <div className="rounded-2xl border border-surface-border bg-card p-4 shadow-card">
            <p className="text-sm font-medium text-foreground">
              Ce produit est actuellement dans la corbeille.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Restaurez-le pour reprendre son édition, ou supprimez-le définitivement.
            </p>

            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/products?view=trash">Retour à la corbeille</Link>
              </Button>
            </div>
          </div>
        </div>
      </AdminPageShell>
    );
  }

  const [
    variantsData,
    imagesData,
    attachableMediaData,
    pricingData,
    productOptions,
    relatedProductOptions,
  ] = await Promise.all([
    readAdminProductVariants(editor.product.id),
    readAdminProductImages(editor.product.id),
    listAttachableMediaAssets(editor.product.id),
    readAdminProductPrices({ productId: editor.product.id }),
    editor.product.productTypeId
      ? readAdminProductTypeWithOptions(editor.product.productTypeId)
      : Promise.resolve([]),
    listAdminRelatedProductOptions({ excludeProductId: editor.product.id }),
  ]);

  return (
    <AdminPageShell
      title={editor.product.name}
      eyebrow="Produits"
      description="Édition du produit, de ses variantes, de ses médias, de ses catégories et de son SEO."
      viewportClassName="!h-full"
      navigation={{ label: "Produits", href: "/admin/products" }}
      breadcrumbs={[
        { label: "Accueil", href: "/admin" },
        { label: "Produits", href: "/admin/products" },
        { label: editor.product.name },
      ]}
      topbarAction={
        <ProductEditorTopbarMenu productId={editor.product.id} productSlug={editor.product.slug} />
      }
      contentClassName="lg:px-6 lg:pb-6"
      actions={
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <DeleteProductButton productId={editor.product.id} onDelete={deleteProductAction} />
            <Button asChild size="sm" className="lg:min-w-40">
              <Link href="/admin/products/new">Nouveau produit</Link>
            </Button>
          </div>
        </div>
      }
      headerDensity="compact"
      compactMobileTitle
      hideDescriptionOnMobile
      headerVisibility="desktop"
    >
      <ProductEditorPanel
        generalAction={updateProductGeneralAction}
        seoAction={updateProductSeoAction}
        categoriesAction={updateProductCategoriesAction}
        availabilityAction={updateProductAvailabilityAction}
        inventoryAction={updateProductInventoryAction}
        relatedProductsAction={updateProductRelatedProductsAction}
        pricingAction={updateProductPricesAction}
        pricingData={pricingData}
        createVariantAction={createProductVariantAction}
        updateVariantAction={updateProductVariantAction}
        setDefaultVariantAction={setDefaultProductVariantAction}
        deleteVariantAction={deleteProductVariantAction}
        setPrimaryImageAction={setProductPrimaryImageAction}
        deleteImageAction={deleteProductImageAction}
        updateAltTextAction={updateProductImageAltTextAction}
        reorderImageAction={reorderProductImageAction}
        attachImagesAction={attachProductImagesAction}
        uploadImagesAction={uploadProductImagesAction}
        availableCategories={availableCategories}
        productTypeOptions={productTypeOptions}
        productOptions={productOptions}
        variants={variantsData?.variants ?? []}
        images={imagesData?.images ?? []}
        attachableMediaItems={attachableMediaData.items}
        relatedProductOptions={relatedProductOptions}
        priceLists={priceLists}
        product={editor}
      />
    </AdminPageShell>
  );
}
