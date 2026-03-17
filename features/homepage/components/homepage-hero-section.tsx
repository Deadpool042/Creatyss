import Image from "next/image";
import Link from "next/link";

type HomepageHeroSectionProps = {
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
};

export function HomepageHeroSection({
  heroImagePath,
  heroText,
  heroTitle
}: HomepageHeroSectionProps) {
  const resolvedTitle =
    heroTitle ?? "Des sacs faits à la main, nulle part ailleurs.";
  const resolvedText =
    heroText ??
    "Chaque sac Creatyss est dessiné, coupé et cousu dans notre atelier en France. Aucun modèle n'est reproduit à l'identique.";

  return (
    <section className="relative -mx-4 -mt-8 grid overflow-hidden border-b border-hero-border bg-hero-bg md:-mx-6 xl:-mx-12 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[56%_44%]">
      {/* Media panel */}
      <div className="relative min-h-80 overflow-hidden bg-hero-bg-media sm:min-h-[24rem] md:min-h-[28rem] lg:min-h-[calc(100svh-5rem)]">
        {heroImagePath ? (
          <>
            <Image
              alt={resolvedTitle}
              className="object-cover object-center md:object-[50%_42%] lg:object-[56%_42%]"
              fill
              priority
              quality={90}
              sizes="(max-width: 767px) 100vw, (min-width: 1100px) 56vw, 100vw"
              src={heroImagePath}
            />
            {/* Vignette top très légère — cadre l'image sans l'éteindre */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,12,6,0.10),transparent_38%)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#d4c9b2_0%,#bfb3a0_35%,#a89680_65%,#7a6452_100%)]" />
        )}

        {/* Photo annotation overlay — masqué si image réelle */}
        {!heroImagePath && (
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
            <div className="text-[0.58rem] font-normal uppercase tracking-[0.34em] text-white/30 min-[1100px]:text-[0.66rem]">
              <p>Photo éditoriale</p>
              <p className="mt-2">Sac principal en situation</p>
              <p className="mt-2 text-[0.5rem] tracking-[0.28em] text-white/20 min-[1100px]:text-[0.56rem]">
                Portrait · lumière naturelle · fond neutre
              </p>
            </div>
          </div>
        )}

        {/* Badge bas-gauche */}
        <div className="absolute bottom-6 left-6 border-l-2 border-ring bg-hero-bg px-4 py-3 ring-1 ring-hero-border/30 md:bottom-7 md:left-7 lg:bottom-12 lg:left-10">
          <p className="font-serif text-[1rem] leading-none text-hero-ink min-[1100px]:text-[1.2rem]">
            Chaque pièce est unique
          </p>
          <p className="mt-2 text-[0.56rem] font-medium uppercase tracking-[0.26em] text-hero-ink-muted min-[1100px]:text-[0.62rem]">
            Fabrication française · fait main
          </p>
        </div>
      </div>

      {/* Panneau éditorial */}
      <div className="relative flex items-center bg-hero-bg px-7 py-12 md:px-8 md:py-14 lg:px-18 lg:py-24">
        <div className="max-w-md">
          {/* Eyebrow — utilise le token brand (terracotta) */}
          <p className="mb-6 text-[0.62rem] font-medium uppercase tracking-[0.34em] text-brand md:mb-7 lg:mb-8 lg:text-[0.68rem]">
            Créations exclusives
          </p>

          {/* H1 serif éditorial — font-light pour plus d'élégance à grande taille */}
          <h1 className="font-serif text-[3.3rem] font-light leading-[0.98] tracking-[-0.02em] text-hero-ink md:text-[4.2rem] lg:text-[5.1rem]">
            <span className="block">Des sacs faits</span>
            <span className="mt-1 block italic lg:mt-2">main,</span>
            <span className="mt-1 block lg:mt-2">nulle part ailleurs.</span>
          </h1>

          <p className="mt-8 max-w-[33ch] text-[0.96rem] font-light leading-9 text-hero-ink-soft md:mt-9 lg:mt-12 lg:text-[1rem]">
            {resolvedText}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5 md:gap-6 lg:mt-14">
            {/* CTA primaire compact */}
            <Link
              className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-7 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
              href="/boutique">
              Découvrir les collections
              <span
                aria-hidden="true"
                className="text-xs">
                →
              </span>
            </Link>

            {/* CTA secondaire ghost éditorial */}
            <Link
              className="inline-flex items-center gap-2.5 border-b border-hero-border pb-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-hero-ink transition-colors hover:border-hero-ink lg:pb-1"
              href="/blog">
              Notre atelier
              <span
                aria-hidden="true"
                className="text-xs">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator vertical */}
      <div className="pointer-events-none absolute bottom-8 right-6 hidden items-center gap-3 lg:flex">
        <div className="h-12 w-px bg-[linear-gradient(to_bottom,var(--color-hero-border),transparent)]" />
        <span className="text-[0.54rem] font-medium uppercase tracking-[0.34em] text-hero-ink-muted [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>
    </section>
  );
}
