import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  archiveProductOptionColorValueAction,
  createProductOptionColorValueAction,
  createProductVariantAction,
  deleteProductAction,
  deleteProductVariantAction,
  setDefaultProductVariantAction,
  updateProductOptionColorValueAction,
  updateProductVariantAction,
} from "@/features/admin/products/editor/actions";
import {
  readAdminProductImages,
  readAdminProductPageContextBySlug,
  readAdminProductTypeWithOptions,
  readAdminProductVariants,
} from "@/features/admin/products/editor/queries";
import { ProductVariantsTab } from "@/features/admin/products/components/editor/product-variants-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

export default async function ProductDetailVariantsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await readAdminProductPageContextBySlug(slug);

  if (product === null) {
    notFound();
  }

  const [variantsData, imagesData, productOptions] = await Promise.all([
    readAdminProductVariants(product.id),
    readAdminProductImages(product.id),
    product.productTypeId
      ? readAdminProductTypeWithOptions(product.productTypeId)
      : Promise.resolve([]),
  ]);
  const [canManageVariants, canManageVariantOptions] = await Promise.all([
    meetsFeatureLevel("catalog.products.variants", "manage"),
    meetsFeatureLevel("catalog.products.variants", "options"),
  ]);

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product,
        pageTitle: "Structure et variantes",
        pageDescription:
          "Gerez les declinaisons, la variante par defaut et les valeurs d'options structurelles sans recharger la page coeur produit.",
        topbarAction: (
          <ProductEditorTopbarMenu
            productId={product.id}
            productSlug={product.slug}
            isArchived={product.isArchived}
            onDelete={deleteProductAction}
          />
        ),
      })}
    >
      <ProductVariantsTab
        productId={product.id}
        productSlug={product.slug}
        variants={variantsData?.variants ?? []}
        images={imagesData?.images ?? []}
        productOptions={productOptions}
        {...(canManageVariants
          ? {
              createAction: createProductVariantAction,
              updateAction: updateProductVariantAction,
              setDefaultAction: setDefaultProductVariantAction,
              deleteAction: deleteProductVariantAction,
            }
          : {})}
        {...(canManageVariantOptions
          ? {
              createOptionColorValueAction: createProductOptionColorValueAction,
              updateOptionColorValueAction: updateProductOptionColorValueAction,
              archiveOptionColorValueAction: archiveProductOptionColorValueAction,
            }
          : {})}
      />
    </AdminPageShell>
  );
}
