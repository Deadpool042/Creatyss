/**
 * Section description partagée — fiche produit.
 *
 * Utilisée par le storefront (app/boutique/[slug]/page.tsx)
 * et la preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 *
 * Lot : PAGE-SHARED-1
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProductDescriptionSectionProps = {
  /** HTML sanitizé côté domaine (validation admin) — prêt à être injecté. */
  descriptionHtml: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductDescriptionSection({ descriptionHtml }: ProductDescriptionSectionProps) {
  return (
    <section className="w-full rounded-xl border border-shell-border/80 bg-linear-to-b from-surface-panel-soft/88 to-surface-subtle/62 p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8">
      <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
        <p className="text-eyebrow text-brand">À propos</p>
        <h2 className="m-0 text-title-section">En quelques mots</h2>
      </div>
      <div
        className="prose prose-sm dark:prose-invert max-w-[68ch] border-t border-surface-border-subtle/70 pt-4 text-foreground min-[900px]:prose-base min-[900px]:pt-5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
        // Le contrat est que `descriptionHtml` a été sanitizé/normalisé en amont
        // (frontière domaine: validateAdminProductInput), et ne contient pas de HTML dangereux.
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </section>
  );
}
