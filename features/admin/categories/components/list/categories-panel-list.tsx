"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { AdminCategoryCardItem, AdminCategoryStatus } from "@/features/admin/categories/list";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  getAdminCategoryDetailPath,
  withAdminCategoryListParams,
} from "@/features/admin/categories/shared/admin-categories-routes";
import { CATEGORY_STATUS_LABELS } from "@/features/admin/categories/config/category-list.config";
import { cn } from "@/lib/utils";
import { useRevealActiveCategoryRow } from "./use-reveal-active-category-row";
import Image from "next/image";

const STATUS_FILTERS: readonly AdminCategoryStatus[] = ["draft", "active", "inactive", "archived"];

function getCategoryStatusBadgeVariant(status: AdminCategoryStatus) {
  if (status === "archived") return "destructive" as const;
  if (status === "draft") return "outline" as const;
  return "secondary" as const;
}

function buildFilterHref(params: { search?: string; status?: string }): string {
  const url = new URLSearchParams();
  if (params.search) url.set("search", params.search);
  if (params.status) url.set("status", params.status);
  const query = url.toString();
  return query ? `${ADMIN_CATEGORIES_LIST_PATH}?${query}` : ADMIN_CATEGORIES_LIST_PATH;
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
  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  const activeSlug = pathname.startsWith(`${ADMIN_CATEGORIES_LIST_PATH}/`)
    ? pathname.slice(ADMIN_CATEGORIES_LIST_PATH.length + 1) || null
    : null;

  useRevealActiveCategoryRow({ activeSlug });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-2 border-b border-surface-border/50 px-3 pb-2.5 pt-2">
        <form action={ADMIN_CATEGORIES_LIST_PATH} method="GET">
          {currentStatus && (
            <input type="hidden" name="status" value={currentStatus} />
          )}
          <Input
            name="search"
            placeholder="Rechercher…"
            defaultValue={currentSearch}
            className="h-8 rounded-full border-white/55 bg-white/60 px-3 text-sm shadow-none"
          />
        </form>

        <div className="flex flex-wrap gap-1">
          <Link
            href={buildFilterHref({ search: currentSearch })}
            className={cn(
              "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors",
              !currentStatus
                ? "bg-primary text-primary-foreground"
                : "border border-white/55 bg-white/60 text-page-foreground hover:bg-white/80"
            )}
          >
            Tous
          </Link>
          {STATUS_FILTERS.map((status) => (
            <Link
              key={status}
              href={buildFilterHref({ search: currentSearch, status })}
              className={cn(
                "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors",
                currentStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-white/55 bg-white/60 text-page-foreground hover:bg-white/80"
              )}
            >
              {CATEGORY_STATUS_LABELS[status]}
            </Link>
          ))}
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-1.5 py-2">
        {categories.map((category) => {
          const detailHref = getAdminCategoryDetailPath(category.slug);
          const isDetailActive = pathname === detailHref;
          const href = withAdminCategoryListParams(
            isDetailActive ? ADMIN_CATEGORIES_LIST_PATH : detailHref,
            searchParams
          );

          return (
            <li key={category.id} className="py-px">
              <Link
                href={href}
                data-category-row={category.slug}
                className={cn(
                  "flex min-h-13 items-center gap-2.5 rounded-r-[1rem] rounded-l-sm border-l-2 border-transparent px-3 py-2 transition-colors",
                  isDetailActive
                    ? "border-brand bg-white/78 shadow-[0_10px_28px_rgba(70,52,38,0.08)] ring-1 ring-white/70"
                    : "hover:bg-white/42"
                )}
                aria-current={isDetailActive ? "page" : undefined}
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
              </Link>
            </li>
          );
        })}

        {categories.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            Aucune catégorie trouvée.
          </li>
        )}
      </ul>
    </div>
  );
}
