import type { ReactNode } from "react";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { resolveAdminProductModuleCapabilities } from "@/features/admin/products/capabilities/product-module-capabilities";
import { readAdminProductModuleFeatureFlags } from "@/features/admin/products/capabilities/read-admin-product-module-feature-flags";
import {
  ProductRouteNav,
  type ProductRouteNavItem,
} from "@/features/admin/products/components/shared/product-route-nav";
import { readAdminProductPageContextBySlug } from "@/features/admin/products/editor/queries";
import { getAdminNavigationContext } from "@/features/admin/navigation/server";
import {
  buildAdminProductAvailabilityPath,
  buildAdminProductCategoriesPath,
  buildAdminProductEditPath,
  buildAdminProductInventoryPath,
  buildAdminProductMediaPath,
  buildAdminProductPricingPath,
  buildAdminProductPreviewPath,
  buildAdminProductRelatedPath,
  buildAdminProductSeoPath,
  buildAdminProductVariantsPath,
} from "@/features/admin/products/navigation";

type AdminProductDetailLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

function buildProductRouteNavItems(input: {
  slug: string;
  capabilities: ReturnType<typeof resolveAdminProductModuleCapabilities>;
}): ProductRouteNavItem[] {
  const items: ProductRouteNavItem[] = [];

  if (input.capabilities.edit) {
    items.push({
      key: "edit",
      label: "Edition",
      href: buildAdminProductEditPath(input.slug),
    });
  }

  if (input.capabilities.preview) {
    items.push({
      key: "preview",
      label: "Apercu",
      href: buildAdminProductPreviewPath(input.slug),
    });
  }

  if (input.capabilities.media) {
    items.push({
      key: "media",
      label: "Medias",
      href: buildAdminProductMediaPath(input.slug),
    });
  }

  if (input.capabilities.seo) {
    items.push({
      key: "seo",
      label: "SEO",
      href: buildAdminProductSeoPath(input.slug),
    });
  }

  if (input.capabilities.pricing) {
    items.push({
      key: "pricing",
      label: "Prix",
      href: buildAdminProductPricingPath(input.slug),
    });
  }

  if (input.capabilities.availability) {
    items.push({
      key: "availability",
      label: "Disponibilite",
      href: buildAdminProductAvailabilityPath(input.slug),
    });
  }

  if (input.capabilities.inventory) {
    items.push({
      key: "inventory",
      label: "Stock",
      href: buildAdminProductInventoryPath(input.slug),
    });
  }

  if (input.capabilities.variants) {
    items.push({
      key: "variants",
      label: "Variantes",
      href: buildAdminProductVariantsPath(input.slug),
    });
  }

  if (input.capabilities.categories) {
    items.push({
      key: "categories",
      label: "Categories",
      href: buildAdminProductCategoriesPath(input.slug),
    });
  }

  if (input.capabilities.related) {
    items.push({
      key: "related",
      label: "Produits lies",
      href: buildAdminProductRelatedPath(input.slug),
    });
  }

  return items;
}

export default async function AdminProductDetailLayout({
  children,
  params,
}: AdminProductDetailLayoutProps) {
  const { slug } = await params;
  const admin = await requireAuthenticatedAdmin();

  const product = await readAdminProductPageContextBySlug(slug);

  if (product === null) {
    return <>{children}</>;
  }

  const [navigationContext, moduleFeatureFlags] = await Promise.all([
    getAdminNavigationContext({
      db,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    }),
    readAdminProductModuleFeatureFlags({
      db,
      storeId: product.storeId,
      userId: admin.id,
    }),
  ]);

  const capabilities = resolveAdminProductModuleCapabilities({
    isArchived: product.isArchived,
    isStandalone: product.isStandalone,
    navigationContext,
    moduleFeatureFlags,
  });

  const items = buildProductRouteNavItems({
    slug: product.slug,
    capabilities,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ProductRouteNav items={items} className="px-4 lg:px-6" />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
