"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSplitViewNav } from "@/components/admin/layout/admin-split-view-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AdminCategoryCardItem, AdminCategoryStatus } from "@/features/admin/categories/list";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  getAdminCategoryDetailPath,
} from "@/features/admin/categories/shared/admin-categories-routes";
import { cn } from "@/lib/utils";
import { useRevealActiveCategoryRow } from "./use-reveal-active-category-row";
import Image from "next/image";

const ALL_STATUSES_VALUE = "all";

const STATUS_LABELS: Record<AdminCategoryStatus, string> = {
  draft: "Brouillon",
  active: "Publiée",
  inactive: "Inactive",
  archived: "Archivée",
};

const STATUS_FILTERS: readonly AdminCategoryStatus[] = ["draft", "active", "inactive", "archived"];

function getCategoryStatusBadgeVariant(status: AdminCategoryStatus) {
  if (status === "archived") return "destructive" as const;
  if (status === "draft") return "outline" as const;
  if (status === "inactive") return "secondary" as const;
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
  const router = useRouter();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES_VALUE);
  const activeSlug = useMemo(() => {
    if (!pathname.startsWith(`${ADMIN_CATEGORIES_LIST_PATH}/`)) {
      return null;
    }

    return pathname.slice(ADMIN_CATEGORIES_LIST_PATH.length + 1) || null;
  }, [pathname]);

  useRevealActiveCategoryRow({ activeSlug });

  const filtered = categories.filter((category) => {
    const matchesStatus = statusFilter === ALL_STATUSES_VALUE || category.status === statusFilter;

    if (!matchesStatus) return false;

    if (!search.trim()) return true;

    const query = search.trim().toLowerCase();
    return category.name.toLowerCase().includes(query);
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-2 border-b border-surface-border/50 px-3 pb-2.5 pt-2">
        <AdminSplitViewNav rootPath="/admin/catalog/categories" />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-full border-white/55 bg-white/60 px-3 text-sm shadow-none"
            />
            <SelectTrigger
              className="h-8 w-34 rounded-full border-white/55 bg-white/60 px-3 text-sm shadow-none"
              size="sm"
            >
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>Tous les statuts</SelectItem>
            {STATUS_FILTERS.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-1.5 py-2">
        {filtered.map((category) => {
          const detailHref = getAdminCategoryDetailPath(category.slug);
          const isDetailActive = pathname === detailHref;
          const href = isDetailActive && !isMobile ? ADMIN_CATEGORIES_LIST_PATH : detailHref;

          return (
            <li key={category.id} className="py-px">
              <Link
                href={href}
                data-category-row={category.slug}
                onClick={(event) => {
                  if (!isDetailActive || isMobile) {
                    return;
                  }

                  event.preventDefault();
                  router.push(ADMIN_CATEGORIES_LIST_PATH, { scroll: false });
                }}
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
                    {STATUS_LABELS[category.status]}
                  </Badge>
                </div>
              </Link>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            Aucune catégorie trouvée.
          </li>
        )}
      </ul>
    </div>
  );
}
