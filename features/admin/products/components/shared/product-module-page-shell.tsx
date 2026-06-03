import type { ComponentProps, ReactNode } from "react";

import type { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { PRODUCT_EDITOR_NAV_COPY } from "@/features/admin/products/config";
import {
  ADMIN_PRODUCTS_LIST_PATH,
  buildAdminProductEditPath,
} from "@/features/admin/products/navigation";

type ProductModulePageShellConfig = {
  product: {
    id: string;
    slug: string;
    name: string;
  };
  pageTitle: string;
  pageDescription: string;
  currentLabel: string;
  currentHref: string;
  topbarAction?: ReactNode;
  headerActions?: ReactNode;
};

type ProductModulePageShellProps = Pick<
  ComponentProps<typeof AdminPageShell>,
  | "title"
  | "navigation"
  | "topbarAction"
  | "scrollMode"
  | "contentPreset"
  | "contentClassName"
  | "breadcrumbs"
  | "showBreadcrumbsInContent"
  | "showTitleInContent"
>;

export const PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME = "lg:pb-0";

export function getProductModulePageShellProps({
  product,
  pageTitle: _pageTitle,
  pageDescription: _pageDescription,
  currentLabel,
  currentHref: _currentHref,
  topbarAction,
  headerActions,
}: ProductModulePageShellConfig): ProductModulePageShellProps {
  return {
    title: product.name,
    navigation: { label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: ADMIN_PRODUCTS_LIST_PATH },
    ...((topbarAction || headerActions)
      ? {
          topbarAction: (
            <div className="flex items-center gap-2">
              {headerActions}
              {topbarAction}
            </div>
          ),
        }
      : {}),
    scrollMode: "nested",
    contentPreset: "full-width",
    contentClassName: PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME,
    breadcrumbs: [
      { label: "Admin", href: "/admin" },
      { label: "Catalogue", href: "/admin/catalog/overview" },
      { label: "Produits", href: ADMIN_PRODUCTS_LIST_PATH },
      { label: product.name, href: buildAdminProductEditPath(product.slug) },
      { label: currentLabel },
    ],
    showBreadcrumbsInContent: false,
    showTitleInContent: false,
  };
}
