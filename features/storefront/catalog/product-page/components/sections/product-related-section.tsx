"use client";

import Image from "next/image";
import Link from "next/link";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useEffect, useState } from "react";

import type { CatalogRelatedProductGroup } from "@/features/storefront/catalog/types";

const MAX_ITEMS_PER_GROUP = 6;

type Props = {
  groups: CatalogRelatedProductGroup[];
  uploadsPublicPath: string;
};

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function RelatedProductCard({
  product,
  uploadsPublicPath,
  typeLabel,
}: {
  product: CatalogRelatedProductGroup["products"][number];
  uploadsPublicPath: string;
  typeLabel?: string;
}) {
  const imageUrl = product.imageFilePath
    ? `${uploadsPublicPath}/${product.imageFilePath.replace(/^\/+/, "")}`
    : null;

  const shortDescription = product.shortDescription ? toPlainText(product.shortDescription) : "";

  return (
    <Link
      href={`/boutique/${product.slug}`}
      className={[
        "group grid h-full content-start gap-2 rounded-xl border border-surface-border-subtle/75 bg-surface-panel/42 p-2 transition-colors",
        "hover:border-control-border-strong hover:bg-control-surface-hover/72 hover:shadow-inset-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      <div className="aspect-square overflow-hidden rounded-[0.95rem] bg-surface-subtle/72 sm:aspect-4/5 [@media(max-height:480px)]:aspect-3/2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.imageAltText ?? product.name}
            width={320}
            height={400}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="grid gap-1.5 px-0.5 pb-0.5">
        {typeLabel ? (
          <p className="text-meta-label text-text-muted-soft [@media(max-height:480px)]:hidden">
            {typeLabel}
          </p>
        ) : null}
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground underline-offset-4 group-hover:underline">
          {product.name}
        </p>
        {shortDescription.length > 0 ? (
          <p className="text-micro-copy reading-compact line-clamp-2 text-text-muted-strong [@media(max-height:480px)]:hidden">
            {shortDescription}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function ProductRelatedSection({ groups, uploadsPublicPath }: Props) {
  const visibleGroups = groups.filter((g) => g.products.length > 0);
  const flattenedProducts = (() => {
    const seen = new Set<string>();
    const result: Array<{
      product: CatalogRelatedProductGroup["products"][number];
      typeLabel: string;
    }> = [];

    for (const group of visibleGroups) {
      for (const product of group.products) {
        if (seen.has(product.id)) continue;
        seen.add(product.id);
        result.push({ product, typeLabel: group.label });
        if (result.length >= MAX_ITEMS_PER_GROUP) {
          return result;
        }
      }
    }

    return result;
  })();

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const update = () => {
      // Prefer real overflow detection so we don't hide affordances when slides are off-viewport
      // (notably on mobile portrait with 1-card-per-view).
      const container = carouselApi.containerNode();
      const hasOverflow = container.scrollWidth - container.clientWidth > 2;
      setShowNav(hasOverflow || carouselApi.canScrollPrev() || carouselApi.canScrollNext());
    };

    update();
    carouselApi.on("reInit", update);
    carouselApi.on("select", update);
    window.addEventListener("resize", update);

    return () => {
      carouselApi.off("reInit", update);
      carouselApi.off("select", update);
      window.removeEventListener("resize", update);
    };
  }, [carouselApi]);

  if (visibleGroups.length === 0 || flattenedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 min-[700px]:gap-5">
      <Carousel
        setApi={setCarouselApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
        aria-label="Produits associés"
      >
        <div className="flex min-w-0 justify-end">
          {showNav ? (
            <div className="flex shrink-0 items-center gap-2">
              <p className="text-micro-copy text-text-muted-soft">
                <span className="sm:hidden">Glissez pour voir plus</span>
                <span className="hidden sm:inline">Faites défiler pour voir plus</span>
              </p>
              <div className="flex items-center gap-1">
                <CarouselPrevious
                  size="icon"
                  className="static h-9 w-9 transform-none translate-x-0 translate-y-0 rounded-full"
                />
                <CarouselNext
                  size="icon"
                  className="static h-9 w-9 transform-none translate-x-0 translate-y-0 rounded-full"
                />
              </div>
            </div>
          ) : null}
        </div>

        <CarouselContent className="ml-0 sm:-ml-3">
          {flattenedProducts.map(({ product, typeLabel }) => (
            <CarouselItem
              key={product.id}
              className="basis-full pl-0 sm:basis-[42%] sm:pl-3 md:basis-[30%] lg:basis-[22%] xl:basis-[18%] 2xl:basis-[15%]"
            >
              <RelatedProductCard
                product={product}
                uploadsPublicPath={uploadsPublicPath}
                typeLabel={typeLabel}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
