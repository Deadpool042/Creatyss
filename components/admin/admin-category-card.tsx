import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Star } from "lucide-react";

import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import { getAdminCategoryDetailPath } from "@/features/admin/categories/shared/admin-categories-routes";
import { cn } from "@/lib/utils";

interface AdminCategoryCardProps {
  category: AdminCategoryCardItem;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "border-surface-border-strong bg-interactive-selected text-foreground",
  },
  draft: {
    label: "Brouillon",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  inactive: {
    label: "Inactive",
    className: "border-surface-border bg-surface-panel-soft text-muted-foreground",
  },
  archived: {
    label: "Archivée",
    className:
      "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  },
} satisfies Record<AdminCategoryCardItem["status"], { label: string; className: string }>;

export function AdminCategoryCard({ category }: AdminCategoryCardProps) {
  const status = statusConfig[category.status];
  const imageAlt = category.primaryImageAlt ?? category.name;

  return (
    <Link
      aria-label={`Ouvrir la catégorie ${category.name}`}
      className="group block h-full min-w-0 rounded-2xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/50"
      href={getAdminCategoryDetailPath(category.slug)}
    >
      <article className="flex h-full min-w-0 flex-col gap-2.5 rounded-2xl border border-surface-border bg-card p-3 shadow-sm transition-[border-color,box-shadow] duration-200 group-hover:border-surface-border-strong group-hover:shadow-md sm:gap-3 sm:p-3.5">
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-surface-panel-soft sm:aspect-8/5">
          {category.primaryImageUrl ? (
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              sizes="(min-width: 1280px) 22rem, (min-width: 768px) 18rem, 100vw"
              src={category.primaryImageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium",
                  status.className
                )}
              >
                {status.label}
              </span>

              {category.isFeatured ? (
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-surface-border-strong bg-interactive-selected px-3 text-xs font-medium text-foreground">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Mis en avant
                </span>
              ) : null}
            </div>

            <h2 className="line-clamp-2 text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
              {category.name}
            </h2>

            {category.description ? (
              <p className="line-clamp-1 text-sm leading-5 text-muted-foreground sm:line-clamp-2">
                {category.description}
              </p>
            ) : (
              <p className="text-sm leading-5 text-muted-foreground">
                Aucune description renseignée pour le moment.
              </p>
            )}
          </div>

          <div className="mt-auto flex min-w-0 items-end justify-between gap-2 pt-0.5">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Adresse
              </p>
              <p className="truncate text-sm font-medium text-foreground">{category.slug}</p>
            </div>

            <span className="shrink-0 text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
              Modifier
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
