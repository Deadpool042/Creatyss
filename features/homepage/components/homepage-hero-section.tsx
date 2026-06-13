import Image from "next/image";
import Link from "next/link";

import { homepageCopyConfig, type HomepageCopy } from "../config/homepage-copy.config";

type HomepageHeroSectionProps = {
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  copy?: HomepageCopy;
};

export function HomepageHeroSection({
  heroImagePath,
  heroText,
  heroTitle,
  copy = homepageCopyConfig,
}: HomepageHeroSectionProps) {
  const resolvedTitle = heroTitle ?? "Des sacs faits main, nulle part ailleurs.";
  const resolvedText = heroText ?? copy.hero.fallbackText;

  if (heroImagePath) {
    return (
      <section className="relative -mx-4 -mt-8 grid overflow-hidden border-b border-hero-border bg-hero-bg md:-mx-6 xl:-mx-12 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[56%_44%]">
        {/* Media panel */}
        <div className="relative min-h-80 overflow-hidden bg-hero-bg-media sm:min-h-96 md:min-h-112 lg:min-h-[calc(100svh-5rem)]">
          <Image
            alt={resolvedTitle}
            className="object-cover object-center md:object-[50%_42%] lg:object-[56%_42%]"
            fill
            priority
            quality={90}
            sizes="(max-width: 767px) 100vw, (min-width: 1100px) 56vw, 100vw"
            src={heroImagePath}
          />
          {/* Vignette top très légère */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--hero-vignette),transparent_38%)]" />

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
          <EditorialContent resolvedText={resolvedText} />
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

  return (
    <section className="relative -mx-4 -mt-8 overflow-hidden border-b border-hero-border bg-hero-bg md:-mx-6 xl:-mx-12">
      <div className="relative flex min-h-[56svh] items-center px-7 py-16 md:min-h-[60svh] md:px-12 md:py-20 lg:px-20 lg:py-28">
        <div className="max-w-2xl">
          <EditorialContent resolvedText={resolvedText} />
        </div>
      </div>
    </section>
  );
}

type EditorialContentProps = {
  resolvedText: string;
};

function EditorialContent({ resolvedText }: EditorialContentProps) {
  return (
    <>
      <p className="mb-6 text-[0.62rem] font-medium uppercase tracking-[0.34em] text-brand md:mb-7 lg:mb-8 lg:text-[0.68rem]">
        Créations exclusives
      </p>

      <h1 className="font-serif text-[3.3rem] font-light leading-[0.98] tracking-[-0.02em] text-hero-ink md:text-[4.2rem] lg:text-[5.1rem]">
        <span className="block">Des sacs faits</span>
        <span className="mt-1 block italic lg:mt-2">main,</span>
        <span className="mt-1 block lg:mt-2">nulle part ailleurs.</span>
      </h1>

      <p className="mt-8 max-w-fit text-[0.96rem] font-light leading-9 text-hero-ink-soft md:mt-9 lg:mt-12 lg:text-[1rem]">
        {resolvedText}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-5 md:gap-6 lg:mt-14">
        <Link
          className="inline-flex items-center gap-2.5 rounded-lg bg-primary px-7 py-3.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          href="/boutique"
        >
          Découvrir les collections
          <span aria-hidden="true" className="text-xs">
            →
          </span>
        </Link>

        <Link
          className="inline-flex items-center gap-2.5 border-b border-hero-border pb-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-hero-ink transition-colors hover:border-hero-ink lg:pb-1"
          href="/blog"
        >
          Notre atelier
          <span aria-hidden="true" className="text-xs">
            →
          </span>
        </Link>
      </div>
    </>
  );
}
