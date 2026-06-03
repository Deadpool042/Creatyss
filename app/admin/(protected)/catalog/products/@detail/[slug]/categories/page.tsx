import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import {
  deleteProductAction,
  updateProductCategoriesAction,
} from "@/features/admin/products/editor/actions";
import {
  listAdminProductCategoryOptions,
  readAdminProductEditorBySlug,
} from "@/features/admin/products/editor/queries";
import { ProductCategoriesTab } from "@/features/admin/products/components/editor/product-categories-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { PRODUCT_CREATE_PAGE_COPY } from "@/features/admin/products/config";
import {
  ADMIN_PRODUCTS_CREATE_PATH,
  buildAdminProductCategoriesPath,
} from "@/features/admin/products/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailCategoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const editor = await readAdminProductEditorBySlug(slug);

  if (editor === null) {
    notFound();
  }

  const availableCategories = await listAdminProductCategoryOptions();

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product: editor.product,
        pageTitle: "Rattachements categories",
        pageDescription:
          "Gerez la categorie principale et les rattachements taxonomiques du produit sans replier cette responsabilite dans le coeur produit.",
        currentLabel: "Categories",
        currentHref: buildAdminProductCategoriesPath(editor.product.slug),
        topbarAction: (
          <ProductEditorTopbarMenu
            productId={editor.product.id}
            productSlug={editor.product.slug}
            isArchived={editor.product.isArchived}
            onDelete={deleteProductAction}
          />
        ),
        headerActions: (
          <Button asChild size="sm" className="lg:min-w-40">
            <Link href={ADMIN_PRODUCTS_CREATE_PATH}>
              {PRODUCT_CREATE_PAGE_COPY.newProductButton}
            </Link>
          </Button>
        ),
      })}
    >
      <ProductCategoriesTab
        action={updateProductCategoriesAction}
        product={editor}
        availableCategories={availableCategories}
      />
    </AdminPageShell>
  );
}
