// features/admin/products/components/editor/product-editor-panel.tsx
"use client";

import { useEffect, useState, type JSX } from "react";

import { useAdminPageTitle } from "@/components/admin/admin-page-title-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-editor-topbar-menu";
import { ProductMediaTopbarMenu } from "@/features/admin/products/components/editor/product-media-topbar-menu";
import { ProductVariantTopbarMenu } from "@/features/admin/products/components/editor/product-variant-topbar-menu";
import type {
  attachProductImagesAction,
  deleteProductImageAction,
  deleteProductVariantAction,
  reorderProductImageAction,
  setDefaultProductVariantAction,
  setProductPrimaryImageAction,
  updateProductImageAltTextAction,
  uploadProductImagesAction,
} from "@/features/admin/products/editor";
import type {
  AdminPriceListOption,
  AdminProductEditorData,
  AdminProductImageItem,
  AdminProductVariantListItem,
  AttachableMediaAssetItem,
  ProductCategoriesFormAction,
  ProductGeneralFormAction,
  ProductSeoFormAction,
  ProductVariantFormAction,
} from "@/features/admin/products/editor/types";
import { cn } from "@/lib/utils";
import { ProductCategoriesTab, type ProductCategoryOption } from "./product-categories-tab";
import { ProductGeneralTab } from "./product-general-tab";
import { ProductImagesTab } from "./product-images-tab";
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

type ProductEditorTabKey = "general" | "variants" | "images" | "categories" | "seo";

type ProductEditorPanelProps = {
  generalAction: ProductGeneralFormAction;
  seoAction: ProductSeoFormAction;
  categoriesAction: ProductCategoriesFormAction;
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
  variants: AdminProductVariantListItem[];
  images: AdminProductImageItem[];
  attachableMediaItems: AttachableMediaAssetItem[];
  priceLists: AdminPriceListOption[];
  product: AdminProductEditorData;
};

const defaultClassNameTabTrigger = cn(
  "h-7 flex-none rounded-full px-3.5 text-[11px] font-medium  sm:px-4 sm:text-sm ",
  "text-muted-foreground",
  "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:outline-none",
  "data-[state=active]:bg-background/90 data-[state=active]:text-foreground",
  "data-[state=active]:shadow-none [@media(max-height:480px)]:h-7"
);

function ProductEditorTabs(): JSX.Element {
  return (
    <div
      className={[
        "site-header-blur absolute left-0 right-0 z-20 border-b border-shell-border/80",
        "top-13.75 [@media(max-height:480px)]:top-11.75 lg:top-0",
        "px-1 py-2 md:px-6 md:py-2.5",
        "lg:px-6 lg:py-3",
        "[@media(max-height:480px)]:px-3 [@media(max-height:480px)]:py-1.5",
      ].join(" ")}
    >
      <div className="no-scrollbar w-full overflow-x-auto overflow-y-hidden">
        <TabsList className="h-auto min-w-max flex-nowrap justify-start gap-1 rounded-full bg-muted/30">
          <TabsTrigger className={defaultClassNameTabTrigger} value="general">
            Général
          </TabsTrigger>

          <TabsTrigger className={defaultClassNameTabTrigger} value="variants">
            Variantes
          </TabsTrigger>

          <TabsTrigger className={defaultClassNameTabTrigger} value="images">
            Galerie
          </TabsTrigger>

          <TabsTrigger className={defaultClassNameTabTrigger} value="categories">
            Catégories
          </TabsTrigger>

          <TabsTrigger className={defaultClassNameTabTrigger} value="seo">
            SEO
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
}

export function ProductEditorPanel({
  generalAction,
  seoAction,
  categoriesAction,
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
  variants,
  images,
  attachableMediaItems,
  priceLists,
  product,
}: ProductEditorPanelProps): JSX.Element {
  const { setPageActionNode } = useAdminPageTitle();
  const [activeTab, setActiveTab] = useState<ProductEditorTabKey>("general");
  const [isCreateVariantOpen, setIsCreateVariantOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

  useEffect(() => {
    if (activeTab === "variants") {
      setPageActionNode(
        <ProductVariantTopbarMenu
          productId={product.id}
          onCreateVariant={() => setIsCreateVariantOpen(true)}
        />
      );
      return;
    }

    if (activeTab === "images") {
      setPageActionNode(
        <ProductMediaTopbarMenu
          productId={product.id}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenUpload={() => setIsUploadFormOpen(true)}
        />
      );
      return;
    }

    setPageActionNode(<ProductEditorTopbarMenu productId={product.id} />);
  }, [activeTab, product.id, setPageActionNode]);

  useEffect(() => {
    return () => {
      setPageActionNode(null);
    };
  }, [setPageActionNode]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-surface-border  shadow-card lg:rounded-2xl ">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ProductEditorTabKey)}
        className="relative flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <ProductEditorTabs />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden ">
          <TabsContent
            value="general"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden "
          >
            <ProductGeneralTab action={generalAction} product={product} />
          </TabsContent>

          <TabsContent
            value="variants"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <ProductVariantsTab
              productId={product.id}
              productSlug={product.slug}
              variants={variants}
              images={images}
              priceLists={priceLists}
              createDialogOpen={isCreateVariantOpen}
              onCreateDialogOpenChange={setIsCreateVariantOpen}
              {...(createVariantAction ? { createAction: createVariantAction } : {})}
              {...(updateVariantAction ? { updateAction: updateVariantAction } : {})}
              {...(setDefaultVariantAction ? { setDefaultAction: setDefaultVariantAction } : {})}
              {...(deleteVariantAction ? { deleteAction: deleteVariantAction } : {})}
            />
          </TabsContent>

          <TabsContent value="images" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
            <ProductImagesTab
              productId={product.id}
              productSlug={product.slug}
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
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <ProductCategoriesTab
              action={categoriesAction}
              product={product}
              availableCategories={availableCategories}
            />
          </TabsContent>

          <TabsContent value="seo" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
            <ProductSeoTab action={seoAction} product={product} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
