/**
 * Bloc éditorial artisanal — fiche produit.
 *
 * Contenu servi par product-page-copy.config (savoir-faire, fabrication
 * locale, identité atelier). Transition éditoriale entre hero et sections
 * secondaires. Partagé storefront + preview admin via product-page-template.
 */

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { productPageCopyConfig } from "../../config/product-page-copy.config";

const editorialCopy = productPageCopyConfig.editorial;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductEditorialSection() {
  return (
    <section className="w-full px-1 py-2 min-[700px]:px-2 min-[1200px]:px-3 ">
      <div className="grid max-w-2xl gap-6">
        <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-brand">
          {editorialCopy.eyebrow}
        </p>

        <h2 className="">
          {editorialCopy.titleLine1}
          <br />
          {editorialCopy.titleLine2}
        </h2>

        <p className="leading-relaxed text-foreground-muted">{editorialCopy.body}</p>

        <Link
          href={editorialCopy.ctaHref}
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          {editorialCopy.ctaLabel}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
