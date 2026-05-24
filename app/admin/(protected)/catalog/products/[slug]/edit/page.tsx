import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { FullWidthPageFrame } from "@/components/shared/layout/full-width-page-frame";
import { FullWidthStack } from "@/components/shared/layout/full-width-stack";
import { Button } from "@/components/ui/button";
import {
  attachProductImagesAction,
  archiveProductOptionColorValueAction,
  createProductOptionColorValueAction,
  createProductVariantAction,
  deleteProductAction,
  deleteProductImageAction,
  deleteProductVariantAction,
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
  updateProductCharacteristicsAction,
  updateProductOptionColorValueAction,
  updateProductSeoAction,
  updateProductVariantAction,
  uploadProductImagesAction,
} from "@/features/admin/products/editor/actions";
import {
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
} from "@/features/admin/products/editor/queries";
import {
  ProductArchivedActions,
  ProductArchivedBanner,
  ProductEditorPanel,
  ProductEditorTopbarMenu,
} from "@/features/admin/products/components";
import { DeleteProductButton } from "@/features/admin/products/components/editor";
import {
  PRODUCT_CREATE_PAGE_COPY,
  PRODUCT_EDITOR_NAV_COPY,
  PRODUCT_EDITOR_PAGE_COPY,
} from "@/features/admin/products/config";

export default async function ProductEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const editor = await readAdminProductEditorBySlug(slug);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        {PRODUCT_EDITOR_PAGE_COPY.notFoundMessage}
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link className="inline-flex items-center gap-2" href="/admin/products">
            {PRODUCT_EDITOR_PAGE_COPY.notFoundBack}
          </Link>
        </Button>
      </div>
    );
  }

  if (editor.product.isArchived) {
    return (
        <AdminPageShell
          title={editor.product.name}
          eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
          description={PRODUCT_EDITOR_PAGE_COPY.archivedDescription}
          pageTitleNavigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: "/admin/products" }}
          topbarAction={
            <ProductEditorTopbarMenu
              productId={editor.product.id}
              productSlug={editor.product.slug}
              isArchived
            />
          }
          scrollMode="area"
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
          <FullWidthPageFrame>
            <FullWidthStack>
              <div className="space-y-4">
                <ProductArchivedBanner />

                <div className="rounded-2xl border border-surface-border bg-card p-4 shadow-card lg:hidden">
                  <ProductArchivedActions productSlug={editor.product.slug} />
                </div>

                <div className="rounded-2xl border border-surface-border bg-card p-4 shadow-card">
                  <p className="text-sm font-medium text-foreground">
                    {PRODUCT_EDITOR_PAGE_COPY.archivedBodyTitle}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {PRODUCT_EDITOR_PAGE_COPY.archivedBodySubtitle}
                  </p>

                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/admin/products?view=trash">
                        {PRODUCT_EDITOR_PAGE_COPY.archivedBackToTrash}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FullWidthStack>
          </FullWidthPageFrame>
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
    availableCategories,
    priceLists,
    productTypeOptions,
  ] = await Promise.all([
    readAdminProductVariants(editor.product.id),
    readAdminProductImages(editor.product.id),
    listAttachableMediaAssets(editor.product.id),
    readAdminProductPrices({ productId: editor.product.id }),
    editor.product.productTypeId
      ? readAdminProductTypeWithOptions(editor.product.productTypeId)
      : Promise.resolve([]),
    listAdminRelatedProductOptions({
      storeId: editor.product.storeId,
      excludeProductId: editor.product.id,
    }),
    listAdminProductCategoryOptions(),
    readAdminPriceLists(),
    listAdminProductTypeOptions({ storeId: editor.product.storeId }),
  ]);

  return (
    <AdminPageShell
      title={editor.product.name}
      eyebrow={PRODUCT_EDITOR_NAV_COPY.eyebrow}
      description={PRODUCT_EDITOR_PAGE_COPY.description}
      pageTitleNavigation={{ label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: "/admin/products" }}
      topbarAction={
        <ProductEditorTopbarMenu productId={editor.product.id} productSlug={editor.product.slug} />
      }
      scrollMode="area"
      actions={
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <DeleteProductButton productId={editor.product.id} onDelete={deleteProductAction} />
            <Button asChild size="sm" className="lg:min-w-40">
              <Link href="/admin/products/new">{PRODUCT_CREATE_PAGE_COPY.newProductButton}</Link>
            </Button>
          </div>
        </div>
      }
      headerDensity="compact"
      compactMobileTitle
      hideDescriptionOnMobile
      headerVisibility="desktop"
    >
      <FullWidthPageFrame>
        <FullWidthStack>
          <ProductEditorPanel
            generalAction={updateProductGeneralAction}
            seoAction={updateProductSeoAction}
            categoriesAction={updateProductCategoriesAction}
            availabilityAction={updateProductAvailabilityAction}
            inventoryAction={updateProductInventoryAction}
            relatedProductsAction={updateProductRelatedProductsAction}
            characteristicsAction={updateProductCharacteristicsAction}
            pricingAction={updateProductPricesAction}
            pricingData={pricingData}
            createVariantAction={createProductVariantAction}
            updateVariantAction={updateProductVariantAction}
            setDefaultVariantAction={setDefaultProductVariantAction}
            deleteVariantAction={deleteProductVariantAction}
            createOptionColorValueAction={createProductOptionColorValueAction}
            updateOptionColorValueAction={updateProductOptionColorValueAction}
            archiveOptionColorValueAction={archiveProductOptionColorValueAction}
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
        </FullWidthStack>
      </FullWidthPageFrame>
    </AdminPageShell>
  );
}
