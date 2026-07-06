import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  deleteProductAction,
  updateProductCharacteristicsAction,
} from "@/features/admin/products/editor/actions";
import { readAdminProductEditorBySlug } from "@/features/admin/products/editor/queries";
import { ProductCharacteristicsTab } from "@/features/admin/products/components/editor/product-characteristics-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";

export const dynamic = "force-dynamic";

export default async function ProductDetailCharacteristicsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const editor = await readAdminProductEditorBySlug(slug);

  if (editor === null) {
    notFound();
  }

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product: editor.product,
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
      <ProductCharacteristicsTab
        action={updateProductCharacteristicsAction}
        productId={editor.product.id}
        initialCharacteristics={editor.product.characteristics}
      />
    </AdminPageShell>
  );
}
