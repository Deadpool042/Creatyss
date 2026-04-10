import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Star } from "lucide-react";

import type { AdminCategoryCardItem } from "@/features/admin/categories/list/types/admin-category-card-item.types";
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
    className: "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  },
} satisfies Record<AdminCategoryCardItem["status"], { label: string; className: string }>;

function InfoTile({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-surface-panel-soft p-4",
        className
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-sm leading-6 text-foreground", valueClassName)}>{value}</p>
    </div>
  );
}

export function AdminCategoryCard({ category }: AdminCategoryCardProps) {
  const status = statusConfig[category.status];
  const imageAlt = category.primaryImageAlt ?? category.name;

  return (
    <Link
      aria-label={`Ouvrir la catégorie ${category.name}`}
      className="group block h-full rounded-4xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring/50"
      href={`/admin/categories/${category.id}`}
    >
      <article className="flex h-full flex-col gap-4 rounded-4xl border border-surface-border bg-card p-4 shadow-card transition-colors duration-200 group-hover:border-surface-border-strong">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-surface-panel-soft">
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

        <div className="flex flex-1 flex-col gap-4">
          <div className="space-y-3">
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

            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
              {category.name}
            </h2>
          </div>

          <div className="grid gap-3">
            <InfoTile label="Slug" value={category.slug} valueClassName="truncate" />

            {category.description ? (
              <div className="rounded-2xl border border-surface-border bg-surface-panel-soft p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Description
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
