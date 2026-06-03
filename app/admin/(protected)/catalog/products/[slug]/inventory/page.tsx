import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  deleteProductAction,
  updateProductInventoryAction,
} from "@/features/admin/products/editor/actions";
import {
  readAdminProductPageContextBySlug,
  readAdminProductVariants,
} from "@/features/admin/products/editor/queries";
import { ProductInventoryTab } from "@/features/admin/products/components/editor/product-inventory-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { buildAdminProductInventoryPath } from "@/features/admin/products/navigation";

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

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product,
        pageTitle: "Stock produit",
        pageDescription:
          "Gerez les quantites physiques et l'etat de stock sans modifier ici la disponibilite vendable.",
        currentLabel: "Stock",
        currentHref: buildAdminProductInventoryPath(product.slug),
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
      />
    </AdminPageShell>
  );
}
