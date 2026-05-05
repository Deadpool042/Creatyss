import Image from "next/image";
import Link from "next/link";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { CustomLink } from "@/components/shared";

type BoutiqueMobileCategoryGridProps = {
  categories: BoutiquePageViewModel["categories"];
  resetHref: string;
};

type CategoryVisual = {
  src: string;
  alt: string;
};

const FALLBACK_CATEGORY_VISUAL_SRC = "/uploads/categories/cat-sac-a-main.webp";

function getCategoryVisual(
  category: BoutiquePageViewModel["categories"][number]
): CategoryVisual | null {
  return category.visual;
}

export function BoutiqueMobileCategoryGrid({
  categories,
  resetHref,
}: BoutiqueMobileCategoryGridProps) {
  const items = categories.slice(0, 8);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="mx-4 grid gap-3 py-4 sm:hidden"
      aria-labelledby="boutique-categories-title"
      data-testid="boutique-mobile-discovery"
    >
      <div className="grid gap-1">
        <div className="flex items-start justify-between gap-2">
          <h2
            id="boutique-categories-title"
            className="m-0 text-base font-semibold leading-tight text-foreground"
          >
            Explorer les créations
          </h2>

          <CustomLink
            href={resetHref}
            className="shrink-0 px-1 py-1 text-xs"
            size="sm"
            variant="navUnderline"
          >
            Voir tout →
          </CustomLink>
        </div>

        <p className="m-0 text-sm leading-snug text-text-muted-strong">
          Parcourez les univers de sacs et accessoires.
        </p>
      </div>

      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
        {items.map((category) => {
          const visual = getCategoryVisual(category);
          const imageSrc = visual?.src ?? FALLBACK_CATEGORY_VISUAL_SRC;

          return (
            <Link
              key={category.id}
              href={category.href}
              aria-current={category.isActive ? "page" : undefined}
              className="group inline-flex shrink-0 snap-start items-center gap-2 rounded-full border border-surface-border-subtle/75 bg-surface-panel/52 px-3 py-2 text-left outline-none transition-all active:scale-95"
            >
              <span
                className={[
                  "relative grid size-9 place-items-center overflow-hidden rounded-full border shadow-sm transition-all duration-300",
                  "border-surface-border-subtle/70 bg-surface-panel/70 dark:bg-surface-panel/42",
                  "group-hover:border-control-border group-hover:bg-surface-panel/85 dark:group-hover:bg-surface-panel/55 group-hover:shadow-md group-hover:ring-1 group-hover:ring-primary",
                  "group-focus-visible:ring-2 group-focus-visible:ring-focus-ring",
                  "group-active:scale-95",
                  category.isActive ? "border-brand/70 bg-brand/10 ring-1 ring-brand/25" : "",
                ].join(" ")}
              >
                <Image
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="36px"
                  className={
                    visual
                      ? "object-cover transition-transform duration-500 group-hover:scale-105"
                      : "object-contain p-1 transition-transform duration-500 group-hover:scale-105"
                  }
                />

                <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/12 via-transparent to-transparent" />
              </span>

              <span
                className={[
                  "line-clamp-1 max-w-24 rounded-full text-xs leading-tight transition-colors",
                  "text-text-muted-strong group-hover:text-foreground",
                  category.isActive ? "font-medium text-foreground" : "",
                ].join(" ")}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
