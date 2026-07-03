import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  deleteProductAction,
  updateProductAvailabilityAction,
} from "@/features/admin/products/editor/actions";
import {
  readAdminProductPageContextBySlug,
  readAdminProductVariants,
} from "@/features/admin/products/editor/queries";
import { ProductAvailabilityTab } from "@/features/admin/products/components/editor/product-availability-tab";
import { ProductEditorTopbarMenu } from "@/features/admin/products/components/editor/product-topbar-menus";
import { getProductModulePageShellProps } from "@/features/admin/products/components/shared/product-module-page-shell";
import { buildAdminProductAvailabilityPath } from "@/features/admin/products/navigation";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

export default async function ProductDetailAvailabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await readAdminProductPageContextBySlug(slug);

  if (product === null) {
    notFound();
  }

  const [variantsData, allowScheduledAvailability, allowPreorderAvailability] = await Promise.all([
    readAdminProductVariants(product.id),
    meetsFeatureLevel("catalog.products.availability", "scheduling"),
    meetsFeatureLevel("catalog.products.availability", "preorder"),
  ]);

  return (
    <AdminPageShell
      {...getProductModulePageShellProps({
        product,
        pageTitle: "Disponibilite vendable",
        pageDescription:
          "Gerez l'etat vendable, les fenetres de vente, la precommande et la rupture sans melanger cette logique avec le stock.",
        currentLabel: "Disponibilite",
        currentHref: buildAdminProductAvailabilityPath(product.slug),
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
      <ProductAvailabilityTab
        action={updateProductAvailabilityAction}
        productId={product.id}
        variants={variantsData?.variants ?? []}
        isStandalone={product.isStandalone}
        allowScheduledAvailability={allowScheduledAvailability}
        allowPreorderAvailability={allowPreorderAvailability}
      />
    </AdminPageShell>
  );
}
