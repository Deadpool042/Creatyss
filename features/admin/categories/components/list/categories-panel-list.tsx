"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { AdminSplitListPane } from "@/components/admin/layout/admin-split-list-pane";
import { AdminSplitOverviewItem } from "@/components/admin/layout/admin-split-overview-item";
import { AdminSplitListItem } from "@/components/admin/layout/admin-split-list-item";
import { AdminPanelListControls } from "@/components/admin/layout/admin-panel-list-controls";
import type { AdminCategoryCardItem, AdminCategoryStatus } from "@/features/admin/categories/list";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  getAdminCategoryDetailPath,
  withAdminCategoryListParams,
} from "@/features/admin/categories/shared/admin-categories-routes";
import {
  CATEGORY_STATUS_LABELS,
  CATEGORY_STATUS_OPTIONS,
} from "@/features/admin/categories/config/category-list.config";
import { useRevealActiveCategoryRow } from "./use-reveal-active-category-row";

function getCategoryStatusBadgeVariant(status: AdminCategoryStatus) {
  if (status === "archived") return "destructive" as const;
  if (status === "draft") return "outline" as const;
  return "secondary" as const;
}

function CategoryThumbnail({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded object-cover"
        aria-hidden
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded bg-surface-panel text-xs font-medium text-page-foreground/60"
      aria-hidden
    >
      {initial}
    </div>
  );
}

type CategoriesPanelListProps = {
  categories: AdminCategoryCardItem[];
};

export function CategoriesPanelList({ categories }: CategoriesPanelListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const overviewHref = `${ADMIN_CATEGORIES_LIST_PATH}/overview`;

  const isOverviewActive = pathname === ADMIN_CATEGORIES_LIST_PATH || pathname === overviewHref;
  const activeSlug = isOverviewActive
    ? "overview"
    : pathname.startsWith(`${ADMIN_CATEGORIES_LIST_PATH}/`)
      ? pathname.slice(ADMIN_CATEGORIES_LIST_PATH.length + 1) || null
      : null;

  useRevealActiveCategoryRow({ activeSlug });

  const controls = (
    <AdminPanelListControls
      listPath={ADMIN_CATEGORIES_LIST_PATH}
      searchPlaceholder="Rechercher…"
      statusOptions={CATEGORY_STATUS_OPTIONS}
      allStatusLabel="Tous les statuts"
      density="compact"
      filterAriaLabel="Filtrer les catégories"
    />
  );

  const emptyState = (
    <li className="px-3 py-6 text-center text-sm text-muted-foreground">
      Aucune catégorie trouvée.
    </li>
  );

  return (
    <AdminSplitListPane
      title="Catégories"
      resultCount={categories.length}
      overview={
        <AdminSplitOverviewItem
          href={withAdminCategoryListParams(overviewHref, searchParams)}
          active={isOverviewActive}
          title="Vue d’ensemble"
          meta={
            <Badge variant="secondary" className="w-fit shrink-0 px-1.5 py-0 text-[10px]">
              {categories.length} catégorie{categories.length > 1 ? "s" : ""}
            </Badge>
          }
        />
      }
      controls={controls}
      isEmpty={categories.length === 0}
      emptyState={<ul>{emptyState}</ul>}
    >
      <ul className="px-1.5 py-2">
        {categories.map((category) => {
          const detailHref = getAdminCategoryDetailPath(category.slug);
          const isDetailActive = pathname === detailHref;
          const href = withAdminCategoryListParams(
            isDetailActive ? overviewHref : detailHref,
            searchParams
          );

          return (
            <li key={category.id} className="py-px">
              <AdminSplitListItem
                href={href}
                active={isDetailActive}
                tooltipContent={category.name}
                data-category-row={category.slug}
                className="flex min-h-13 items-center gap-2.5 rounded-r-[1rem] rounded-l-sm"
              >
                <CategoryThumbnail name={category.name} imageUrl={category.primaryImageUrl} />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate text-[13px] font-medium text-page-foreground">
                    {category.name}
                  </span>
                  <Badge
                    variant={getCategoryStatusBadgeVariant(category.status)}
                    className="w-fit shrink-0 px-1.5 py-0 text-[10px]"
                  >
                    {CATEGORY_STATUS_LABELS[category.status]}
                  </Badge>
                </div>
              </AdminSplitListItem>
            </li>
          );
        })}
      </ul>
    </AdminSplitListPane>
  );
}
