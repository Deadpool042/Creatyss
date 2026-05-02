"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type { CatalogRelatedProductGroup } from "@/features/storefront/catalog/types";

const MAX_GROUPS = 3;
const MAX_TOTAL_ITEMS = 6;

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
  relationEyebrow,
}: {
  product: CatalogRelatedProductGroup["products"][number];
  uploadsPublicPath: string;
  relationEyebrow: string;
}) {
  const imageUrl = product.imageFilePath
    ? `${uploadsPublicPath}/${product.imageFilePath.replace(/^\/+/, "")}`
    : null;

  const shortDescription = product.shortDescription ? toPlainText(product.shortDescription) : "";

  return (
    <Link
      href={`/boutique/${product.slug}`}
      className={[
        "group grid h-full content-start gap-2 rounded-lg border border-surface-border-subtle/75 bg-surface-panel/42 p-1.5 transition-colors min-[700px]:rounded-xl min-[700px]:p-2",
        "hover:border-control-border-strong hover:bg-control-surface-hover/72 hover:shadow-inset-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      ].join(" ")}
    >
      <div className="aspect-5/4 overflow-hidden rounded-[0.8rem] bg-surface-subtle/72 min-[700px]:rounded-[0.95rem] sm:aspect-4/5 [@media(max-height:480px)]:aspect-3/2">
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
        <p className="text-meta-label text-text-muted-soft">{relationEyebrow}</p>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground underline-offset-4 group-hover:underline">
          {product.name}
        </p>
        {shortDescription.length > 0 ? (
          <p className="text-micro-copy reading-compact line-clamp-1 text-text-muted-strong min-[480px]:line-clamp-2 [@media(max-height:560px)]:hidden">
            {shortDescription}
          </p>
        ) : null}
        {product.price != null ? (
          <p className="text-sm font-semibold text-foreground">{product.price}</p>
        ) : null}
        {product.availabilityLabel != null ? (
          <p
            className={[
              "text-micro-copy",
              product.availabilityLabel === "En stock"
                ? "text-feedback-success-foreground"
                : product.availabilityLabel === "Sur commande"
                  ? "text-text-muted-strong"
                  : "text-text-muted-soft",
            ].join(" ")}
          >
            {product.availabilityLabel}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function getRelationEyebrow(type: CatalogRelatedProductGroup["type"]): string {
  if (type === "cross_sell" || type === "accessory") {
    return "À associer";
  }

  if (type === "similar") {
    return "Alternative similaire";
  }

  if (type === "up_sell") {
    return "Version premium";
  }

  return "À découvrir";
}

export function ProductRelatedSection({ groups, uploadsPublicPath }: Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [snapCount, setSnapCount] = useState(0);
  const [activeSnap, setActiveSnap] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    const update = () => {
      const container = carouselApi.containerNode();
      const hasOverflow = container.scrollWidth - container.clientWidth > 2;
      setShowNav(hasOverflow || carouselApi.canScrollPrev() || carouselApi.canScrollNext());
      setSnapCount(carouselApi.scrollSnapList().length);
      setActiveSnap(carouselApi.selectedScrollSnap());
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
  const visibleGroups = groups.filter((group) => group.products.length > 0).slice(0, MAX_GROUPS);
  const normalizedGroups = visibleGroups.map((group) => ({ ...group, products: [...group.products] }));
  const selectedGroups = normalizedGroups.map((group) => ({
    ...group,
    products: [] as CatalogRelatedProductGroup["products"],
  }));

  const seenProductIds = new Set<string>();
  const baseQuotaPerGroup = selectedGroups.length > 0 ? Math.max(1, Math.floor(MAX_TOTAL_ITEMS / selectedGroups.length)) : 0;

  for (let groupIndex = 0; groupIndex < normalizedGroups.length; groupIndex += 1) {
    const sourceGroup = normalizedGroups[groupIndex];
    const targetGroup = selectedGroups[groupIndex];
    if (!sourceGroup || !targetGroup) continue;

    for (const product of sourceGroup.products) {
      if (targetGroup.products.length >= baseQuotaPerGroup) break;
      if (seenProductIds.has(product.id)) continue;
      targetGroup.products.push(product);
      seenProductIds.add(product.id);
    }
  }

  let totalSelected = selectedGroups.reduce((sum, group) => sum + group.products.length, 0);

  while (totalSelected < MAX_TOTAL_ITEMS) {
    let didAdd = false;

    for (let groupIndex = 0; groupIndex < normalizedGroups.length; groupIndex += 1) {
      if (totalSelected >= MAX_TOTAL_ITEMS) break;

      const sourceGroup = normalizedGroups[groupIndex];
      const targetGroup = selectedGroups[groupIndex];
      if (!sourceGroup || !targetGroup) continue;

      const nextProduct = sourceGroup.products.find((product) => !seenProductIds.has(product.id));
      if (!nextProduct) continue;

      targetGroup.products.push(nextProduct);
      seenProductIds.add(nextProduct.id);
      totalSelected += 1;
      didAdd = true;
    }

    if (!didAdd) break;
  }

  const groupedProducts = selectedGroups.filter((group) => group.products.length > 0);
  const flattenedProducts = groupedProducts.flatMap((group) =>
    group.products.map((product) => ({
      product,
      relationEyebrow: getRelationEyebrow(group.type),
    }))
  );

  if (flattenedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 min-[700px]:gap-4">
      <Carousel
        setApi={setCarouselApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
        aria-label="Produits associés"
      >
        <div className="flex min-w-0 justify-end">
          {showNav ? (
            <div className="hidden shrink-0 items-center gap-1 sm:flex">
              <CarouselPrevious
                size="icon"
                className="static h-8 w-8 translate-x-0 translate-y-0 rounded-full"
              />
              <CarouselNext
                size="icon"
                className="static h-8 w-8 translate-x-0 translate-y-0 rounded-full"
              />
            </div>
          ) : null}
        </div>

        <CarouselContent className="-ml-2 pb-0.5 sm:-ml-3">
          {flattenedProducts.map(({ product, relationEyebrow }) => (
            <CarouselItem
              key={product.id}
              className="basis-full pl-2 min-[480px]:basis-[72%] sm:basis-[42%] sm:pl-3 md:basis-[34%] lg:basis-[30%]"
            >
              <RelatedProductCard
                product={product}
                uploadsPublicPath={uploadsPublicPath}
                relationEyebrow={relationEyebrow}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {snapCount > 1 ? (
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {Array.from({ length: snapCount }, (_, index) => {
            const isActive = index === activeSnap;
            return (
              <button
                key={`related-dot-${index + 1}`}
                type="button"
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Aller à la page ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "w-4 bg-foreground/85"
                    : "w-1.5 bg-foreground/25 hover:bg-foreground/45",
                ].join(" ")}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
