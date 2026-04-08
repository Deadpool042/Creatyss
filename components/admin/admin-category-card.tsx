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
    className: "bg-primary/10 text-primary",
  },
  draft: {
    label: "Brouillon",
    className: "bg-muted text-muted-foreground",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground",
  },
  archived: {
    label: "Archivée",
    className: "bg-destructive/10 text-destructive",
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
      className={cn("rounded-2xl border border-border-soft bg-surface-panel-soft p-4", className)}
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
      className="group block h-full"
      href={`/admin/categories/${category.id}`}
    >
      <article className="flex h-full flex-col gap-4 rounded-4xl border border-border-soft bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
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
              <span className={cn("badge-base border-transparent", status.className)}>
                {status.label}
              </span>

              {category.isFeatured ? (
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 text-xs font-medium text-primary">
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
              <div className="rounded-2xl border border-border-soft bg-surface-panel-soft p-4">
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
