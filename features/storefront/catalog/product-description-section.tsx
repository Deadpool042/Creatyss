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
  description: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductDescriptionSection({ description }: ProductDescriptionSectionProps) {
  return (
    <section className="w-full rounded-xl border border-shell-border bg-surface-panel-soft p-4 shadow-soft min-[700px]:p-6 min-[900px]:p-8">
      <div className="mb-3 min-[700px]:mb-5 grid gap-1.5 min-[700px]:gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand">Description</p>
        <h2 className="m-0">À propos de ce produit</h2>
      </div>
      <div
        className="prose prose-sm dark:prose-invert max-w-3xl text-hero-ink-soft min-[900px]:prose-base [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </section>
  );
}
