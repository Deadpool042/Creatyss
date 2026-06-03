import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — Creatyss",
  description: "Creatyss est un atelier artisanal basé à Saint-Étienne. Découvrez l'histoire, la démarche et les valeurs de la créatrice.",
};

export default function AProposPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-20 xl:px-0">
      {/* Header éditorial */}
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          L'atelier
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          À propos de Creatyss
        </h1>
      </header>

      {/* Corps éditorial */}
      <div className="space-y-10 text-base leading-relaxed text-foreground">
        <section>
          <h2 className="mb-4 font-serif text-2xl font-light tracking-tight">
            Un atelier à Saint-Étienne
          </h2>
          <p className="text-muted-foreground">
            Creatyss est un atelier créatif basé au cœur de Saint-Étienne. Chaque pièce est
            pensée, dessinée et fabriquée à la main, avec une attention particulière portée aux
            matières, aux détails et à la durabilité.
          </p>
        </section>

        <div className="h-px bg-surface-border/60" />

        <section>
          <h2 className="mb-4 font-serif text-2xl font-light tracking-tight">
            La démarche artisanale
          </h2>
          <p className="text-muted-foreground">
            Sans cuir animal. Avec des matières sélectionnées pour leur qualité et leur impact
            réduit. Les créations Creatyss valorisent un savoir-faire manuel et une production
            locale, loin des circuits industriels.
          </p>
        </section>

        <div className="h-px bg-surface-border/60" />

        <section>
          <h2 className="mb-4 font-serif text-2xl font-light tracking-tight">
            Pièces uniques et sur-mesure
          </h2>
          <p className="text-muted-foreground">
            Chaque sac, pochette ou accessoire est une pièce unique ou produite en très petite
            série. Le sur-mesure est possible pour les projets personnalisés — contactez-nous pour
            en discuter.
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/boutique"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Découvrir la boutique
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
