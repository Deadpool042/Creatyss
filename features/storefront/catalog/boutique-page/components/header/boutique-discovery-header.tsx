import Image from "next/image";

import { PlaceholderImage } from "@/components/shared/placeholder-image";

type BoutiqueDiscoveryHeaderProps = {
  productCountLabel: string;
  activeCategoryName?: string | null;
  heroImage: {
    lightSrc: string;
    darkSrc: string;
  } | null;
};

export function BoutiqueDiscoveryHeader({
  productCountLabel,
  activeCategoryName,
  heroImage,
}: BoutiqueDiscoveryHeaderProps) {
  return (
    <div
      className="relative isolate min-h-44 overflow-hidden bg-transparent px-0 sm:hidden"
      data-testid="boutique-mobile-hero"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden">
        {heroImage ? (
          <>
            <Image
              alt=""
              aria-hidden="true"
              className="object-contain object-center opacity-80 dark:hidden"
              fill
              priority
              sizes="320px"
              src={heroImage.lightSrc}
            />

            <Image
              alt=""
              aria-hidden="true"
              className="hidden object-contain object-center opacity-80 dark:block"
              fill
              priority
              sizes="320px"
              src={heroImage.darkSrc}
            />
          </>
        ) : (
          <PlaceholderImage alt="Creatyss" className="bg-transparent opacity-45" />
        )}
      </div>

      {/* <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-background/94 via-background/86 to-background/40" /> */}

      <div className="relative z-10 grid min-h-44 w-3/5 content-center gap-2 px-3 py-6">
        <p className="m-0 text-xs font-medium uppercase tracking-wide text-brand/90">
          Collection Creatyss
        </p>
        <h1 className="m-0">Boutique</h1>

        <p className="m-0 text-sm leading-relaxed text-text-muted-strong">
          {activeCategoryName
            ? `Catégorie active : ${activeCategoryName}`
            : "Découvrez nos créations faites main avec passion."}
        </p>

        <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
      </div>
    </div>
  );
}
