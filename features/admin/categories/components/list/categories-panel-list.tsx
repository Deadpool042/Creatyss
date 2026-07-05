"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSplitListPane } from "@/components/admin/layout/admin-split-list-pane";
import { AdminSplitOverviewItem } from "@/components/admin/layout/admin-split-overview-item";
import { AdminSplitListItem } from "@/components/admin/layout/admin-split-list-item";
import { AdminPanelListControls } from "@/components/admin/layout/admin-panel-list-controls";
import type { AdminCategoryCardItem, AdminCategoryStatus } from "@/features/admin/categories/list";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  ADMIN_CATEGORIES_NEW_PATH,
  getAdminCategoryDetailPath,
  withAdminCategoryListParams,
} from "@/features/admin/categories/shared/admin-categories-routes";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_LIST_DEFAULT_SORT,
  CATEGORY_SORT_OPTIONS,
  CATEGORY_STATUS_LABELS,
  CATEGORY_STATUS_OPTIONS,
} from "@/features/admin/categories/config/category-list.config";
import { useRevealActiveCategoryRow } from "./use-reveal-active-category-row";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function formatProductsLabel(count: number) {
  return `${count} produit${count > 1 ? "s" : ""}`;
}

function formatChildrenLabel(count: number) {
  return `${count} sous-cat.${count > 1 ? "" : ""}`;
}

type CategoriesPanelListProps = {
  categories: AdminCategoryCardItem[];
};

export function CategoriesPanelList({ categories }: CategoriesPanelListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const overviewHref = `${ADMIN_CATEGORIES_LIST_PATH}/overview`;
  const publishedCount = categories.filter((category) => category.status === "active").length;
  const featuredCount = categories.filter((category) => category.isFeatured).length;
  const linkedProductsCount = categories.reduce((sum, category) => sum + category.productCount, 0);

  const isOverviewActive = pathname === ADMIN_CATEGORIES_LIST_PATH || pathname === overviewHref;
  const activeSlug = isOverviewActive
    ? "overview"
    : pathname.startsWith(`${ADMIN_CATEGORIES_LIST_PATH}/`)
      ? pathname.slice(ADMIN_CATEGORIES_LIST_PATH.length + 1) || null
      : null;

  useRevealActiveCategoryRow({ activeSlug });

  const controlsProps = {
    listPath: ADMIN_CATEGORIES_LIST_PATH,
    searchPlaceholder: CATEGORY_LIST_COPY.searchPlaceholder,
    statusOptions: CATEGORY_STATUS_OPTIONS,
    allStatusLabel: CATEGORY_LIST_COPY.splitAllStatusLabel,
    sortOptions: CATEGORY_SORT_OPTIONS,
    defaultSort: CATEGORY_LIST_DEFAULT_SORT,
    sortLabel: CATEGORY_LIST_COPY.splitSortLabel,
    density: "compact" as const,
    filterAriaLabel: CATEGORY_LIST_COPY.splitFilterAriaLabel,
  };

  const emptyState = (
    <li className="px-3 py-6 text-center text-sm text-muted-foreground">
      Aucune catégorie trouvée.
    </li>
  );

  return (
    <AdminSplitListPane
      title={CATEGORY_LIST_COPY.splitPanelTitle}
      resultCount={categories.length}
      controls={<AdminPanelListControls {...controlsProps} visibility="desktop" />}
      mobileControls={<AdminPanelListControls {...controlsProps} visibility="mobile" />}
      overview={
        <div className="space-y-3">
          <div className="rounded-[1.35rem] border border-surface-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-panel)_92%,white)_0%,color-mix(in_srgb,var(--surface-panel)_74%,var(--shell-surface))_100%)] p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Lecture rapide
                </p>
                <p className="text-sm font-medium text-foreground">
                  Structurez la navigation boutique avant d’entrer dans le détail.
                </p>
                <p className="text-xs leading-5 text-muted-foreground">
                  Les catégories publiées, mises en avant et déjà reliées aux produits se lisent ici
                  d’un coup d’œil.
                </p>
              </div>

              <Button asChild size="sm" className="rounded-full">
                <Link href={ADMIN_CATEGORIES_NEW_PATH}>Nouvelle</Link>
              </Button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <CategoryStatPill label="Publiées" value={publishedCount} />
              <CategoryStatPill label="Mises en avant" value={featuredCount} />
              <CategoryStatPill label="Produits reliés" value={linkedProductsCount} />
            </div>
          </div>

          <AdminSplitOverviewItem
            href={withAdminCategoryListParams(overviewHref, searchParams)}
            active={isOverviewActive}
            title="Vue d’ensemble des catégories"
            description="Ouvrez la synthèse de la hiérarchie, des catégories à fort impact et des repères d’exploitation."
            meta={
              <Badge variant="secondary" className="w-fit shrink-0 px-1.5 py-0 text-[10px]">
                {categories.length} catégorie{categories.length > 1 ? "s" : ""}
              </Badge>
            }
            warning={publishedCount === 0 ? "Aucune catégorie publiée" : undefined}
          />
        </div>
      }
      isEmpty={categories.length === 0}
      emptyState={<ul>{emptyState}</ul>}
    >
      <ScrollArea>
        <ul className="px-1.5 py-2  ">
          {categories.map((category) => {
            const detailHref = getAdminCategoryDetailPath(category.slug);
            const isDetailActive = pathname === detailHref;
            const href = withAdminCategoryListParams(
              isDetailActive ? overviewHref : detailHref,
              searchParams
            );

            return (
              <li key={category.id} className="py-px ">
                <AdminSplitListItem
                  href={href}
                  active={isDetailActive}
                  tooltipContent={category.name}
                  data-category-row={category.slug}
                  className="flex min-h-16 items-center gap-2.5 rounded-r-[1rem] rounded-l-sm"
                >
                  <CategoryThumbnail name={category.name} imageUrl={category.primaryImageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] font-medium text-page-foreground">
                        {category.name}
                      </span>
                      {category.isFeatured ? (
                        <Badge variant="outline" className="w-fit shrink-0 px-1.5 py-0 text-[10px]">
                          {CATEGORY_LIST_COPY.featuredBadgeLabel}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant={getCategoryStatusBadgeVariant(category.status)}
                        className="w-fit shrink-0 px-1.5 py-0 text-[10px]"
                      >
                        {CATEGORY_STATUS_LABELS[category.status]}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {formatProductsLabel(category.productCount)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatChildrenLabel(category.childrenCount)}
                      </span>
                    </div>
                  </div>
                </AdminSplitListItem>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </AdminSplitListPane>
  );
}

function CategoryStatPill({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/70 px-3 py-2.5">
      <p className="text-lg font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
