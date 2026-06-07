import type { Metadata } from "next";
import Link from "next/link";
import { MapPinIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Les marchés — Creatyss",
  description: "Retrouvez Creatyss sur les marchés artisanaux et créatifs de la région. Dates et lieux à venir.",
};

export default function LesMarchesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-20 xl:px-0">
      {/* Header */}
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Rencontres
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          Les marchés
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Venez découvrir et toucher les créations Creatyss en vrai, sur les marchés artisanaux et créatifs de la région.
        </p>
      </header>

      {/* Placeholder calendrier */}
      <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-8 text-center">
        <MapPinIcon className="mx-auto mb-4 size-8 text-muted-foreground/30" />
        <p className="font-serif text-xl font-light text-foreground">Calendrier à venir</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Les prochaines dates de marché seront publiées ici très prochainement.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/60">
          Suivez-nous pour ne rien manquer — ou écrivez-nous directement.
        </p>
      </div>

      {/* Infos atelier */}
      <div className="mt-12 space-y-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
          <div>
            <p className="font-medium text-foreground">Atelier basé à Saint-Étienne</p>
            <p>Loire, Auvergne-Rhône-Alpes</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Nous contacter
        </Link>
        <Link
          href="/boutique"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Commander en ligne
        </Link>
      </div>
    </div>
  );
}
