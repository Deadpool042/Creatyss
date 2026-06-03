import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { deleteProductAction, updateProductSeoAction } from "@/features/admin/products/editor/actions";
import { readAdminProductEditorBySlug } from "@/features/admin/products/editor/queries";
import { ProductSeoTab } from "@/features/admin/products/components/editor/product-seo-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { buildAdminProductSeoPath } from "@/features/admin/products/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailSeoPage({
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
        pageTitle: "SEO produit",
        pageDescription:
          "Gerez le referencement, l'indexation, l'URL canonique et les apercus de partage du produit.",
        currentLabel: "SEO",
        currentHref: buildAdminProductSeoPath(editor.product.slug),
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
      <ProductSeoTab action={updateProductSeoAction} product={editor} />
    </AdminPageShell>
  );
}
