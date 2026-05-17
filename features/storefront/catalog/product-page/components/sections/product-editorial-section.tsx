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
    <section className="w-full px-1 py-2 min-[700px]:px-2 min-[1200px]:px-3 ">
      <div className="grid max-w-2xl gap-6">
        <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-brand">Savoir-faire</p>

        <h2 className="">
          Fabriqué à la main
          <br />à Saint-Étienne
        </h2>

        <p className="leading-relaxed text-foreground-muted">
          Chaque pièce est pensée, dessinée et fabriquée à la main dans mon atelier stéphanois. Je
          sélectionne des matières choisies avec exigence et réalise des finitions soignées, pour
          des pièces uniques, pensées pour durer.
        </p>

        <Link
          href="/a-propos"
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          Découvrir mon atelier
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
