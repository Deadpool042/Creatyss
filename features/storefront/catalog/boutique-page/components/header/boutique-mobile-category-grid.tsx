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
      className="boutique-mobile-category-discovery"
      aria-labelledby="boutique-categories-title"
      data-testid="boutique-mobile-discovery"
    >
      <div className="boutique-mobile-category-header">
        <div className="boutique-mobile-category-heading">
          <h2 id="boutique-categories-title" className="boutique-mobile-category-title">
            Explorer les créations
          </h2>

          <p className="boutique-mobile-category-description">
            Parcourez les univers de sacs et accessoires.
          </p>
        </div>

        <CustomLink
          href={resetHref}
          className="boutique-mobile-category-reset"
          size="sm"
          variant="navUnderline"
        >
          Voir tout →
        </CustomLink>
      </div>

      <div className="boutique-mobile-category-rail" aria-label="Catégories">
        {items.map((category) => {
          const visual = getCategoryVisual(category);
          const imageSrc = visual?.src ?? FALLBACK_CATEGORY_VISUAL_SRC;

          return (
            <Link
              key={category.id}
              href={category.href}
              aria-current={category.isActive ? "page" : undefined}
              className="boutique-mobile-category-chip group"
              data-active={category.isActive ? "true" : "false"}
            >
              <span className="boutique-mobile-category-image">
                <Image
                  src={imageSrc}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="36px"
                  className={
                    visual
                      ? "boutique-mobile-category-image-media object-cover group-hover:scale-105"
                      : "boutique-mobile-category-image-media object-contain p-1 group-hover:scale-105"
                  }
                />

                <span className="boutique-mobile-category-image-overlay" />
              </span>

              <span className="boutique-mobile-category-label">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
