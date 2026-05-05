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
      className="grid gap-2.5 pt-0.5 min-[560px]:hidden"
      aria-labelledby="boutique-categories-title"
    >
      <div className="flex items-center justify-between">
        <h2 id="boutique-categories-title" className="m-0 text-sm font-semibold text-brand">
          Catégories
        </h2>

        <CustomLink
          href={resetHref}
          className="capitalize px-1.5 py-2 text-[0.68rem]"
          size="sm"
          variant="navUnderline"
        >
          Voir tout
        </CustomLink>
      </div>

      <div className="flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-1 pb-1">
        {items.map((category) => {
          const visual = getCategoryVisual(category);
          const imageSrc = visual?.src ?? FALLBACK_CATEGORY_VISUAL_SRC;

          return (
            <Link
              key={category.id}
              href={category.href}
              aria-current={category.isActive ? "page" : undefined}
              className="group inline-flex shrink-0 snap-start items-center gap-2 rounded-full border border-surface-border-subtle/75 bg-surface-panel/52 px-2.5 py-1.5 text-left outline-none transition-transform active:scale-[0.98]"
            >
              <span
                className={[
                  "relative grid size-8 place-items-center overflow-hidden rounded-full border shadow-sm transition-all duration-300",
                  "border-surface-border-subtle/70 bg-surface-panel/70 dark:bg-surface-panel/42",
                  "group-hover:border-control-border group-hover:bg-surface-panel/85 dark:group-hover:bg-surface-panel/55 group-hover:shadow-md group-hover:ring-1 group-hover:ring-primary",
                  "group-focus-visible:ring-2 group-focus-visible:ring-focus-ring",
                  "group-active:scale-[0.96]",
                  category.isActive ? "border-brand/40 bg-surface-panel/62" : "",
                ].join(" ")}
              >
                <Image
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="32px"
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
