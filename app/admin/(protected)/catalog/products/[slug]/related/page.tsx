import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  deleteProductAction,
  updateProductRelatedProductsAction,
} from "@/features/admin/products/editor/actions";
import {
  listAdminRelatedProductOptions,
  readAdminProductEditorBySlug,
} from "@/features/admin/products/editor/queries";
import { ProductRelatedProductsTab } from "@/features/admin/products/components/editor/product-related-products-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { buildAdminProductRelatedPath } from "@/features/admin/products/navigation";
import { isRelatedProductsFeatureActive } from "@/features/admin/catalog/queries/is-related-products-feature-active.query";

export const dynamic = "force-dynamic";

export default async function ProductDetailRelatedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const featureActive = await isRelatedProductsFeatureActive();
  if (!featureActive) {
    notFound();
  }

  const editor = await readAdminProductEditorBySlug(slug);

  if (editor === null) {
    notFound();
  }

  const relatedProductOptions = await listAdminRelatedProductOptions({
    storeId: editor.product.storeId,
    excludeProductId: editor.product.id,
  });

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product: editor.product,
        pageTitle: "Produits lies",
        pageDescription:
          "Gerez les relations merchandising bornees : related, cross-sell, up-sell, accessory et similar.",
        currentLabel: "Produits lies",
        currentHref: buildAdminProductRelatedPath(editor.product.slug),
        topbarAction: (
          <ProductEditorTopbarMenu
            productId={editor.product.id}
            productSlug={editor.product.slug}
            isArchived={editor.product.isArchived}
            onDelete={deleteProductAction}
          />
        ),
      })}
    >
      <ProductRelatedProductsTab
        action={updateProductRelatedProductsAction}
        product={editor}
        relatedProductOptions={relatedProductOptions}
      />
    </AdminPageShell>
  );
}
