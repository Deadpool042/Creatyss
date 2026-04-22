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
    <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
      <div className="mb-6 grid gap-2">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">Description</p>
        <h2 className="m-0">À propos de ce produit</h2>
      </div>
      <div
        className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </section>
  );
}
