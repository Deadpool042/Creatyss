import { Separator } from "@/components/ui/separator";

type BoutiquePageHeaderProps = {
  productCountLabel: string;
  activeCategoryName: string | null;
};

export function BoutiquePageHeader({
  productCountLabel,
  activeCategoryName,
}: BoutiquePageHeaderProps) {
  return (
    <section className="w-full" data-testid="boutique-page-header">
      {/* Portrait / desktop — hero light éditorial */}
      <div
        className="relative left-1/2 isolate w-full -translate-x-1/2 overflow-hidden bg-background-secondary dark:bg-background "
        data-testid="boutique-mobile-hero"
      >
        <div className="relative h-56 w-full xs:h-60 mobile:h-64 tablet:h-68 laptop:h-68">
          {/* Image de fond light */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[url('/images/storefront/boutique/hero/bg-hero-light-v3.webp')] bg-cover bg-no-repeat bg-position-[80%_center] opacity-100 transition-opacity duration-500 ease-out xs:bg-position-[76%_center] mobile:bg-position-[72%_center] tablet:bg-position-[right_center] tablet:bg-size-[auto_100%] dark:opacity-0"
          />

          {/* Image de fond dark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[url('/images/storefront/boutique/hero/bg-hero-dark.webp')] bg-cover bg-no-repeat bg-position-[84%_center] opacity-0 transition-opacity duration-500 ease-out xs:bg-position-[80%_center] mobile:bg-position-[76%_center] tablet:bg-position-[right_center] tablet:bg-size-[auto_100%] dark:opacity-100"
          />

          {/* Dégradé light */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-r from-background-secondary via-background-secondary via-35% to-transparent transition-none xs:via-30% mobile:via-28% tablet:via-20% laptop:via-18% dark:opacity-0"
          />

          {/* Dégradé dark — transition progressive, évite le bloc noir brutal */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-r from-background via-background/92 via-42% to-transparent opacity-0 transition-none xs:via-38% mobile:via-34% tablet:via-26% laptop:via-30% dark:opacity-100"
          />

          {/* Contenu */}
          <div className="relative z-10 mx-auto flex h-full w-full max-w-430 items-center px-4 tablet:px-6 laptop:px-10">
            <div className="flex w-full flex-col gap-2 py-6 max-w-56 xs:max-w-[16rem] mobile:max-w-[18rem] tablet:max-w-md laptop:gap-3">
              <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand">
                {activeCategoryName
                  ? `Sélection ${activeCategoryName}`
                  : "Créations uniques, faites main à Saint-Étienne"}
              </p>

              <h1 className="m-0 font-serif text-3xl font-medium leading-[1.05] tracking-[0.02em] text-foreground/80 tablet:text-4xl laptop:text-5xl">
                Des sacs artisanaux faits main.
              </h1>

              <Separator className="max-w-15 border border-brand" />

              <p className="m-0 text-xs italic leading-relaxed text-hero-ink-soft line-clamp-2 tablet:text-sm laptop:line-clamp-none">
                Chaque pièce est imaginée et cousue à la main dans mon atelier stéphanois avec
                passion, exigence et engagement.
              </p>

              <p className="m-0 text-xs text-muted-foreground">{productCountLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
