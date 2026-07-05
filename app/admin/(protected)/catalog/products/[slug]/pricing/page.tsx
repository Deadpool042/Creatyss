import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { deleteProductAction, updateProductPricesAction } from "@/features/admin/products/editor/actions";
import {
  readAdminPriceLists,
  readAdminProductPageContextBySlug,
  readAdminProductPrices,
} from "@/features/admin/products/editor/queries";
import { ProductPricingTab } from "@/features/admin/products/components/editor/product-pricing-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

export default async function ProductDetailPricingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await readAdminProductPageContextBySlug(slug);

  if (product === null) {
    notFound();
  }

  const [pricingData, priceLists, canManagePriceLists, canManageScheduledPricing] = await Promise.all([
    readAdminProductPrices({ productId: product.id }),
    readAdminPriceLists(),
    meetsFeatureLevel("catalog.products.pricing", "price-lists"),
    meetsFeatureLevel("catalog.products.pricing", "scheduled-pricing"),
  ]);
  const visiblePriceLists = canManagePriceLists
    ? priceLists
    : priceLists.filter((priceList) => priceList.isDefault);

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product,
        pageTitle: "Prix produit",
        pageDescription:
          "Gerez le prix boutique, les listes de prix et les fenetres tarifaires sans melanger cette responsabilite avec le coeur produit.",
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
      <ProductPricingTab
        action={updateProductPricesAction}
        priceLists={visiblePriceLists}
        pricingData={pricingData}
        isStandalone={product.isStandalone}
        allowAdvancedPriceLists={canManagePriceLists}
        allowScheduledPricing={canManageScheduledPricing}
      />
    </AdminPageShell>
  );
}
