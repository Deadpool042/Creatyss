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
    <section
      className="w-full relative bg-background-secondary dark:bg-background overflow-hidden"
      data-testid="boutique-page-header"
    >
      {/* Zone bornée à 106rem (≈1696px).
          Pas de overflow-hidden : les background-image CSS sont clippées à leur div.
          Le double gradient couvre les deux bords sans overflow-hidden. */}
      <div
        className="relative mx-auto h-56 w-full max-w-424 xs:h-60 mobile:h-64 tablet:h-68 laptop:h-68"
        data-testid="boutique-mobile-hero"
      >
        {/* Image de fond light */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/images/storefront/boutique/hero/bg-hero-light-v3.webp')] bg-cover bg-no-repeat bg-position-[80%_center] opacity-100 transition-opacity duration-500 ease-out xs:bg-position-[76%_center] mobile:bg-position-[72%_center] tablet:bg-position-[80%_center] tablet:bg-size-[auto_100%] wide:bg-position-[96%_center] dark:opacity-0"
        />

        {/* Image de fond dark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/images/storefront/boutique/hero/bg-hero-dark.webp')] bg-cover bg-no-repeat bg-position-[70%_center] opacity-0 transition-opacity duration-500 ease-out  mobile:bg-position-[76%_center] tablet:bg-position-[80%_center] tablet:bg-size-[auto_100%] wide:bg-position-[right_center] dark:opacity-100"
        />

        {/* Dégradé gauche light — protection texte.
            Utilise /0 plutôt que transparent pour éviter l'interpolation vers le noir. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-background-secondary via-background-secondary via-10% to-background-secondary/0 transition-none dark:opacity-0"
        />

        {/* Dégradé droit light — fondu image → section.
            Activé uniquement quand le hero est borné (> 106rem = 1696px).
            Faible opacité pour ne pas tinter l'image, juste fondre le bord. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 2k:opacity-100 bg-linear-to-r from-background-secondary/0 via-background-secondary/20 via-82% to-background-secondary transition-none dark:hidden"
        />

        {/* Dégradé gauche dark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-background via-background/92 via-12% to-transparent opacity-0 transition-none xs:via-38% mobile:via-34% tablet:via-26% laptop:via-30% wide:via-20% ultrawide:via-15% 2k:via-0% dark:opacity-100"
        />

        {/* Dégradé droit dark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 2k:opacity-100 bg-linear-to-l from-background via-background/0 via-10% to-transparent transition-none hidden dark:block"
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
    </section>
  );
}
