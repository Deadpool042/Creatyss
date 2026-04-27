/**
 * Bloc éditorial artisanal — fiche produit.
 *
 * Contenu statique Creatyss : savoir-faire, fabrication locale, identité atelier.
 * Transition éditoriale entre hero et sections secondaires.
 * Partagé storefront + preview admin via product-page-template.
 */

import Link from "next/link";

import { ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductEditorialSection() {
  return (
    <section className="w-full overflow-hidden rounded-2xl bg-hero-bg px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      <div className="grid max-w-2xl gap-6">
        <p className="text-eyebrow text-brand">Savoir-faire</p>

        <h2 className="text-title-section text-foreground">
          Fabriqué à la main
          <br />
          à Saint-Étienne
        </h2>

        <p className="max-w-prose text-secondary-copy reading-relaxed text-foreground-muted">
          Chaque pièce est pensée, dessinée et fabriquée à la main dans notre atelier stéphanois.
          Nous travaillons des matériaux nobles et sélectionnons chaque cuir avec exigence.
        </p>

        <Link
          href="/a-propos"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          Découvrir notre atelier
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
