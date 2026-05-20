"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";

import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryStatusBadge } from "../shared/category-status-badge";
import { CategoryTableRowActions } from "./category-table-row-actions";

function CategoryMobileInfoBox({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-panel-soft px-2.5 py-2">
      <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div className="min-h-0 text-[13px] leading-5 text-foreground">{children}</div>
    </div>
  );
}

function CategoryMobileVisual({
  category,
}: Readonly<{
  category: AdminCategoryCardItem;
}>) {
  return (
    <AdminThumbnail
      src={category.primaryImageUrl}
      alt={category.primaryImageAlt ?? category.name}
      className="h-12 w-12 shrink-0 rounded-xl border border-surface-border bg-surface-panel-soft sm:h-11 sm:w-11"
      fallbackLabel={`Aucun visuel pour ${category.name}`}
    />
  );
}

function CategoryMobileCard({
  category,
}: Readonly<{ category: AdminCategoryCardItem }>) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-surface-border bg-card p-3 shadow-card">
      <div className="mb-2 flex items-center justify-end">
        <CategoryTableRowActions categoryId={category.id} categoryName={category.name} />
      </div>

      <div className="flex items-start gap-2.5">
        <CategoryMobileVisual category={category} />

        <div className="min-w-0 flex-1">
          <Link href={`/admin/categories/${category.id}`} className="block">
            <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-tight text-foreground sm:line-clamp-1">
              {category.name}
            </h3>
          </Link>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            Adresse · <span className="font-medium text-foreground">{category.slug}</span>
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <CategoryStatusBadge status={category.status} />

            {category.isFeatured ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground">
                <Star aria-hidden="true" className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>Mise en avant</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <CategoryMobileInfoBox label="Description">
          <p className="line-clamp-2 text-[13px] leading-5 text-muted-foreground">
            {category.description ?? "—"}
          </p>
        </CategoryMobileInfoBox>

        <CategoryMobileInfoBox label="Mise en avant">
          {category.isFeatured ? (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>Oui</span>
            </span>
          ) : (
            <p className="text-[13px] font-medium leading-5 text-muted-foreground">Non</p>
          )}
        </CategoryMobileInfoBox>
      </div>
    </article>
  );
}

export function CategoryTableMobile() {
  const { categories } = useCategoriesTableContext();

  return (
    <div className="grid min-w-0 grid-cols-1 gap-2.5 overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] [@media(max-height:480px)]:gap-2 [@media(max-height:480px)]:pb-[calc(4rem+env(safe-area-inset-bottom))] md:grid-cols-2 md:gap-3 lg:hidden">
      {categories.map((category) => (
        <CategoryMobileCard key={category.id} category={category} />
      ))}
    </div>
  );
}
