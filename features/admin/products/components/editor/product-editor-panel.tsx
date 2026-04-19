"use client";

import { useEffect, useState, type JSX } from "react";

import { useAdminPageTitle } from "@/components/admin/admin-page-title-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-editor-topbar-menu";
import { ProductMediaTopbarMenu } from "@/features/admin/products/components/editor/product-media-topbar-menu";
import { ProductVariantTopbarMenu } from "@/features/admin/products/components/editor/product-variant-topbar-menu";
import {
  type attachProductImagesAction,
  type deleteProductImageAction,
  type deleteProductVariantAction,
  type setDefaultProductVariantAction,
  type setProductPrimaryImageAction,
  type updateProductImageAltTextAction,
  type uploadProductImagesAction,
  type reorderProductImageAction,
  type AdminPriceListOption,
  type AdminProductEditorData,
  type AdminProductImageItem,
  type AdminProductOptionItem,
  type AdminProductPricingData,
  type AdminProductVariantListItem,
  type AttachableMediaAssetItem,
  type ProductCategoriesFormAction,
  type ProductGeneralFormAction,
  type ProductAvailabilityFormAction,
  type ProductInventoryFormAction,
  type ProductPricingFormAction,
  type ProductRelatedProductsFormAction,
  type ProductSeoFormAction,
  type ProductVariantFormAction,
} from "@/features/admin/products/editor/public";
import { cn } from "@/lib/utils";
import { ProductAvailabilityTab } from "./product-availability-tab";
import { ProductCategoriesTab, type ProductCategoryOption } from "./product-categories-tab";
import { ProductGeneralTab } from "./product-general-tab";
import { ProductImagesTab } from "./product-images-tab";
import { ProductInventoryTab } from "./product-inventory-tab";
import { ProductPricingTab } from "./product-pricing-tab";
import {
  ProductRelatedProductsTab,
  type RelatedProductOption,
} from "./product-related-products-tab";
import { ProductSeoTab } from "./product-seo-tab";
import { ProductVariantsTab } from "./product-variants-tab";

type SetProductPrimaryImageAction = typeof setProductPrimaryImageAction;
type UploadProductImagesAction = typeof uploadProductImagesAction;
type DeleteProductImageAction = typeof deleteProductImageAction;
type UpdateProductImageAltTextAction = typeof updateProductImageAltTextAction;
type ReorderProductImageAction = typeof reorderProductImageAction;
type AttachProductImagesAction = typeof attachProductImagesAction;
type SetDefaultProductVariantAction = typeof setDefaultProductVariantAction;
type DeleteProductVariantAction = typeof deleteProductVariantAction;

type ProductEditorTabKey =
  | "general"
  | "variants"
  | "availability"
  | "inventory"
  | "images"
  | "categories"
  | "related-products"
  | "seo"
  | "pricing";

type ProductEditorPanelProps = {
  generalAction: ProductGeneralFormAction;
  seoAction: ProductSeoFormAction;
  categoriesAction: ProductCategoriesFormAction;
  availabilityAction: ProductAvailabilityFormAction;
  inventoryAction: ProductInventoryFormAction;
  relatedProductsAction: ProductRelatedProductsFormAction;
  pricingAction: ProductPricingFormAction;
  pricingData: AdminProductPricingData;
  setPrimaryImageAction?: SetProductPrimaryImageAction;
  deleteImageAction?: DeleteProductImageAction;
  updateAltTextAction?: UpdateProductImageAltTextAction;
  reorderImageAction?: ReorderProductImageAction;
  attachImagesAction?: AttachProductImagesAction;
  createVariantAction?: ProductVariantFormAction;
  updateVariantAction?: ProductVariantFormAction;
  setDefaultVariantAction?: SetDefaultProductVariantAction;
  deleteVariantAction?: DeleteProductVariantAction;
  uploadImagesAction?: UploadProductImagesAction;
  availableCategories: ProductCategoryOption[];
  productTypeOptions?: Array<{
    id: string;
    code: string;
    name: string;
    slug: string;
    isActive: boolean;
  }>;
  productOptions?: AdminProductOptionItem[];
  variants: AdminProductVariantListItem[];
  images: AdminProductImageItem[];
  attachableMediaItems: AttachableMediaAssetItem[];
  relatedProductOptions: RelatedProductOption[];
  priceLists: readonly AdminPriceListOption[];
  product: AdminProductEditorData;
};

const defaultClassNameTabTrigger = cn(
  "h-7 flex-none rounded-full px-3 text-[11px] font-medium sm:px-3.5 sm:text-xs md:h-8 md:px-4 md:text-sm",
  "border border-transparent text-muted-foreground",
  "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none",
  "data-[state=active]:border-surface-border data-[state=active]:bg-background data-[state=active]:text-foreground",
  "data-[state=active]:shadow-card [@media(max-height:480px)]:h-7"
);

function ProductEditorTabs({ isStandalone }: { isStandalone: boolean }): JSX.Element {
  return (
    <div className="min-w-0 shrink-0 border-b border-surface-border bg-card px-2 py-1.5 sm:px-3 md:px-4 md:py-2">
      <div className="no-scrollbar w-full overflow-x-auto overflow-y-hidden">
        <div className="inline-flex min-w-full justify-start">
          <TabsList
            variant="line"
            className="h-auto min-w-max flex-nowrap justify-start gap-1 rounded-none p-0"
          >
            <TabsTrigger className={defaultClassNameTabTrigger} value="general">
              Général
            </TabsTrigger>
            {!isStandalone && (
              <TabsTrigger className={defaultClassNameTabTrigger} value="variants">
                Variantes
              </TabsTrigger>
            )}
            <TabsTrigger className={defaultClassNameTabTrigger} value="pricing">
              Tarification
            </TabsTrigger>
            <TabsTrigger className={defaultClassNameTabTrigger} value="availability">
              Disponibilité
            </TabsTrigger>
            <TabsTrigger className={defaultClassNameTabTrigger} value="inventory">
              Stock
            </TabsTrigger>
            <TabsTrigger className={defaultClassNameTabTrigger} value="images">
              Médias
            </TabsTrigger>
            <TabsTrigger className={defaultClassNameTabTrigger} value="categories">
              Catégories
            </TabsTrigger>
            <TabsTrigger className={defaultClassNameTabTrigger} value="related-products">
              Produits liés
            </TabsTrigger>
            <TabsTrigger className={defaultClassNameTabTrigger} value="seo">
              SEO
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </div>
  );
}

export function ProductEditorPanel({
  generalAction,
  seoAction,
  categoriesAction,
  availabilityAction,
  inventoryAction,
  relatedProductsAction,
  pricingAction,
  pricingData,
  createVariantAction,
  updateVariantAction,
  setDefaultVariantAction,
  deleteVariantAction,
  setPrimaryImageAction,
  deleteImageAction,
  updateAltTextAction,
  reorderImageAction,
  attachImagesAction,
  uploadImagesAction,
  availableCategories,
  productTypeOptions = [],
  productOptions = [],
  variants,
  images,
  attachableMediaItems,
  relatedProductOptions,
  priceLists,
  product,
}: ProductEditorPanelProps): JSX.Element {
  const { setPageActionNode } = useAdminPageTitle();
  const [activeTab, setActiveTab] = useState<ProductEditorTabKey>("general");
  const [isCreateVariantOpen, setIsCreateVariantOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const relatedProductsTabKey = [
    product.product.id,
    ...product.product.relatedProducts.map(
      (link) => `${link.targetProductId}:${link.type}:${link.sortOrder}`
    ),
  ].join("|");

  useEffect(() => {
    if (activeTab === "variants" && !product.product.isStandalone) {
      setPageActionNode(
        <ProductVariantTopbarMenu
          productId={product.product.id}
          onCreateVariant={() => setIsCreateVariantOpen(true)}
        />
      );
      return;
    }

    if (activeTab === "images") {
      setPageActionNode(
        <ProductMediaTopbarMenu
          productId={product.product.id}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenUpload={() => setIsUploadFormOpen(true)}
        />
      );
      return;
    }

    setPageActionNode(
      <ProductEditorTopbarMenu
        productId={product.product.id}
        productSlug={product.product.slug}
        isArchived={product.product.isArchived}
      />
    );
  }, [
    activeTab,
    product.product.id,
    product.product.slug,
    product.product.isArchived,
    product.product.isStandalone,
    setPageActionNode,
  ]);

  useEffect(() => {
    return () => {
      setPageActionNode(null);
    };
  }, [setPageActionNode]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as ProductEditorTabKey)}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden pt-10.5 lg:pt-0"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:rounded-3xl border border-surface-border bg-card shadow-card ">
        <ProductEditorTabs isStandalone={product.product.isStandalone} />

        <TabsContent
          value="general"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductGeneralTab
            action={generalAction}
            product={product}
            productTypeOptions={productTypeOptions}
          />
        </TabsContent>

        {!product.product.isStandalone && (
          <TabsContent
            value="variants"
            className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          >
            <ProductVariantsTab
              productId={product.product.id}
              productSlug={product.product.slug}
              variants={variants}
              images={images}
              productOptions={productOptions}
              createDialogOpen={isCreateVariantOpen}
              onCreateDialogOpenChange={setIsCreateVariantOpen}
              {...(createVariantAction ? { createAction: createVariantAction } : {})}
              {...(updateVariantAction ? { updateAction: updateVariantAction } : {})}
              {...(setDefaultVariantAction ? { setDefaultAction: setDefaultVariantAction } : {})}
              {...(deleteVariantAction ? { deleteAction: deleteVariantAction } : {})}
            />
          </TabsContent>
        )}

        <TabsContent
          value="pricing"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductPricingTab
            action={pricingAction}
            priceLists={priceLists}
            pricingData={pricingData}
            isStandalone={product.product.isStandalone}
          />
        </TabsContent>

        <TabsContent
          value="availability"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductAvailabilityTab
            action={availabilityAction}
            productId={product.product.id}
            variants={variants}
            isStandalone={product.product.isStandalone}
          />
        </TabsContent>

        <TabsContent
          value="inventory"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductInventoryTab
            action={inventoryAction}
            productId={product.product.id}
            variants={variants}
            isStandalone={product.product.isStandalone}
          />
        </TabsContent>

        <TabsContent
          value="images"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductImagesTab
            productId={product.product.id}
            productSlug={product.product.slug}
            images={images}
            attachableMediaItems={attachableMediaItems}
            attachLibraryOpen={isLibraryOpen}
            onAttachLibraryOpenChange={setIsLibraryOpen}
            uploadFormOpen={isUploadFormOpen}
            onUploadFormOpenChange={setIsUploadFormOpen}
            {...(setPrimaryImageAction ? { setPrimaryImageAction } : {})}
            {...(deleteImageAction ? { deleteImageAction } : {})}
            {...(updateAltTextAction ? { updateAltTextAction } : {})}
            {...(reorderImageAction ? { reorderImageAction } : {})}
            {...(attachImagesAction ? { attachImagesAction } : {})}
            {...(uploadImagesAction ? { uploadImagesAction } : {})}
          />
        </TabsContent>

        <TabsContent
          value="categories"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductCategoriesTab
            action={categoriesAction}
            product={product}
            availableCategories={availableCategories}
          />
        </TabsContent>

        <TabsContent
          value="related-products"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductRelatedProductsTab
            key={relatedProductsTabKey}
            action={relatedProductsAction}
            product={product}
            relatedProductOptions={relatedProductOptions}
          />
        </TabsContent>

        <TabsContent
          value="seo"
          className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <ProductSeoTab action={seoAction} product={product} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
