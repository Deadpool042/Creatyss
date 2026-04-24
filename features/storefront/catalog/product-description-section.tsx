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
    <section className="w-full rounded-xl border border-shell-border bg-surface-panel-soft p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8">
      <div className="mb-5 grid gap-2 min-[700px]:mb-6">
        <p className="text-eyebrow text-brand">Description</p>
        <h2 className="m-0 text-title-section">À propos de ce produit</h2>
      </div>
      <div
        className="prose prose-sm dark:prose-invert max-w-3xl text-foreground min-[900px]:prose-base [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
        // Le contrat est que `descriptionHtml` a été sanitizé/normalisé en amont
        // (frontière domaine: validateAdminProductInput), et ne contient pas de HTML dangereux.
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </section>
  );
}
