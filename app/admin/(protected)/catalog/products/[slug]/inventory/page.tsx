import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import {
  deleteProductAction,
  updateProductInventoryAction,
} from "@/features/admin/products/editor/actions";
import {
  getAdminProductInventoryForecast,
  readAdminProductPageContextBySlug,
  readAdminProductVariants,
} from "@/features/admin/products/editor/queries";
import { ProductInventoryTab } from "@/features/admin/products/components/editor/product-inventory-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";

export const dynamic = "force-dynamic";

export default async function ProductDetailInventoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await readAdminProductPageContextBySlug(slug);

  if (product === null) {
    notFound();
  }

  const variantsData = await readAdminProductVariants(product.id);
  const [showLowStockThreshold, showInventoryForecasting] = await Promise.all([
    meetsFeatureLevel("catalog.products.inventory", "alerts"),
    meetsFeatureLevel("catalog.products.inventory", "forecasting"),
  ]);
  const inventoryForecast =
    showInventoryForecasting && variantsData !== null
      ? await getAdminProductInventoryForecast(
          product.id,
          variantsData.variants.map((variant) => ({
            id: variant.id,
            availableQuantity: variant.inventory.availableQuantity,
          }))
        )
      : new Map();

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product,
        pageTitle: "Stock produit",
        pageDescription:
          "Gerez les quantites physiques et l'etat de stock sans modifier ici la disponibilite vendable.",
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
      <ProductInventoryTab
        action={updateProductInventoryAction}
        productId={product.id}
        variants={variantsData?.variants ?? []}
        isStandalone={product.isStandalone}
        showLowStockThreshold={showLowStockThreshold}
        showInventoryForecasting={showInventoryForecasting}
        inventoryForecast={inventoryForecast}
      />
    </AdminPageShell>
  );
}
