import type { ComponentProps, ReactNode } from "react";

import type { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { PRODUCT_EDITOR_NAV_COPY } from "@/features/admin/products/config";
import {
  ADMIN_PRODUCTS_LIST_PATH,
  buildAdminProductBreadcrumbs,
} from "@/features/admin/products/navigation";

type ProductModulePageShellConfig = {
  product: {
    id: string;
    slug: string;
    name: string;
  };
  topbarAction?: ReactNode;
  headerActions?: ReactNode;
};

type ProductModulePageShellProps = Pick<
  ComponentProps<typeof AdminPageShell>,
  | "title"
  | "navigation"
  | "topbarAction"
  | "scrollBehavior"
  | "contentPreset"
  | "contentClassName"
  | "breadcrumbs"
  | "showBreadcrumbsInContent"
  | "showTitleInContent"
>;

export const PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME = "lg:pb-0";

/**
 * Grille commune à tous les onglets de l'éditeur produit (contenu principal + panneau latéral
 * 21rem). Le plafond de largeur est aligné sur le preset "detail" du shell (max-w-7xl) : avant,
 * ce conteneur recapait indépendamment à max-w-6xl, ce qui resserrait la page en dessous de ce
 * que le shell autorisait déjà — deux autorités de largeur qui se contredisaient.
 */
export const PRODUCT_EDITOR_TAB_LAYOUT_CLASSNAME =
  "mx-auto grid w-full max-w-7xl gap-6 px-4 py-4 md:px-6 md:py-6 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start xl:px-0 [@media(max-height:480px)]:gap-4 [@media(max-height:480px)]:py-3";

export function getProductModulePageShellProps({
  product,
  topbarAction,
  headerActions,
}: ProductModulePageShellConfig): ProductModulePageShellProps {
  return {
    title: product.name,
    navigation: { label: PRODUCT_EDITOR_NAV_COPY.navLabel, href: ADMIN_PRODUCTS_LIST_PATH },
    ...(topbarAction || headerActions
      ? {
          topbarAction: (
            <div className="flex items-center gap-2">
              {headerActions}
              {topbarAction}
            </div>
          ),
        }
      : {}),
    scrollBehavior: "page",
    contentPreset: "detail",
    contentClassName: PRODUCT_MODULE_PAGE_CONTENT_CLASSNAME,
    breadcrumbs: buildAdminProductBreadcrumbs(product.name),
    showTitleInContent: false,
  };
}
