import { Separator } from "@/components/ui/separator";

type BoutiquePageHeaderProps = {
  productCountLabel: string;
  activeCategoryName: string | null;
};

export function BoutiquePageHeader({
  productCountLabel,
  activeCategoryName: _activeCategoryName,
}: BoutiquePageHeaderProps) {
  return (
    <section className="w-full" data-testid="boutique-page-header">
      {/* Portrait / desktop — hero light éditorial */}
      <div className="">
        <div
          className="relative left-1/2 isolate w-screen -translate-x-1/2 overflow-hidden bg-background-secondary dark:bg-background"
          data-testid="boutique-mobile-hero"
        >
          <div className="relative h-64 w-full sm:h-72 lg:h-80">
            {/* Image de fond light */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -right-5/12 bg-[url('/images/storefront/boutique/hero/bg-hero-light-v3.webp')] bg-cover bg-right bg-no-repeat opacity-100 transition-opacity duration-500 ease-out md:right-0 md:bg-size-[auto_100%] dark:opacity-0"
            />

            {/* Image de fond dark */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -right-5/12 bg-[url('/images/storefront/boutique/hero/bg-hero-dark.webp')] bg-cover bg-right bg-no-repeat opacity-0 transition-opacity duration-500 ease-out md:right-0 md:bg-size-[auto_100%] dark:opacity-100"
            />

            {/* Dégradé — couvre la gauche sur mobile, s'efface vers la droite */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-r from-background-secondary via-background-secondary via-50% to-transparent transition-none md:via-10% dark:from-background dark:via-background/70 dark:to-transparent"
            />

            {/* Contenu */}
            <div className="relative z-10 mx-auto flex h-full max-w-430 items-center px-4 sm:px-6 lg:px-10">
              <div className="flex w-full md:max-w-md flex-col gap-2.5 py-6 lg:gap-3">
                <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand">
                  Créations uniques, faites main à Saint-Étienne
                </p>

                <h1 className="m-0 font-serif text-3xl font-medium leading-[1.05] tracking-[0.02em] text-foreground/80  sm:text-4xl lg:text-5xl">
                  Des sacs artisanaux faits main.
                </h1>

                <Separator className=" border border-brand max-w-15" />

                <p className="m-0 text-sm italic leading-relaxed text-hero-ink-soft line-clamp-2 lg:line-clamp-none">
                  Chaque pièce est imaginée et cousue à la main dans mon atelier stéphanois avec
                  passion, exigence et engagement.
                </p>

                <p className="m-0 text-xs text-muted-foreground">{productCountLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
