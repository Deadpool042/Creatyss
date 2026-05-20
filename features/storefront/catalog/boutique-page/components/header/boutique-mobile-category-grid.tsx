import Image from "next/image";
import Link from "next/link";

import { CustomLink } from "@/components/shared";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

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
      className="grid gap-3.5ablet:hidden"
      aria-labelledby="boutique-categories-title"
      data-testid="boutique-mobile-discovery"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h2
            id="boutique-categories-title"
            className="m-0 text-base font-[650] leading-[1.15] text-foreground"
          >
            Explorer les créations
          </h2>

          <p className="m-0 text-sm leading-[1.35] text-text-muted-strong">
            Parcourez les univers de sacs et accessoires.
          </p>
        </div>

        <CustomLink
          href={resetHref}
          className="shrink-0 font-bold  uppercase text-brand"
          size="sm"
          variant="navUnderline"
        >
          Voir tout →
        </CustomLink>
      </div>

      <nav
        data-testid="boutique-mobile-category-rail"
        className="flex gap-2 overflow-x-auto pb-1 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Catégories"
      >
        {items.map((category) => {
          const visual = getCategoryVisual(category);
          const imageSrc = visual?.src ?? FALLBACK_CATEGORY_VISUAL_SRC;

          return (
            <Link
              key={category.id}
              href={category.href}
              aria-current={category.isActive ? "page" : undefined}
              className="group inline-flex shrink-0 items-center gap-2 min-h-12 rounded-full border border-surface-border-subtle bg-surface-panel py-1.5 pl-1.5 pr-3 text-text-muted-strong outline-none snap-start transition-colors hover:border-control-border-strong hover:text-foreground active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-focus-ring/42 data-[active=true]:border-brand/72 data-[active=true]:bg-brand/8 data-[active=true]:text-foreground"
              data-active={category.isActive ? "true" : "false"}
            >
              <span className="relative grid shrink-0 size-9 place-items-center overflow-hidden rounded-full border border-surface-border-subtle bg-surface-panel/78 group-data-[active=true]:border-brand/70 group-data-[active=true]:bg-brand/[0.14]">
                <Image
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="36px"
                  className={
                    visual
                      ? "transition-transform object-cover group-hover:scale-105"
                      : "transition-transform object-contain p-1 group-hover:scale-105"
                  }
                />

                <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-background/16" />
              </span>

              <span className="max-w-26 truncate text-xs font-medium leading-[1.1] group-data-[active=true]:font-[650]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
