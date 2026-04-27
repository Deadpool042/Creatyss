/**
 * Bloc pré-header éditorial — fiche produit.
 *
 * Accroche minimale avant le hero transactionnel : badge type · nom produit · accroche commerciale.
 * Sobre, sans carte, aligné à gauche — iOS/macOS-like.
 * Partagé storefront + preview admin via product-page-template.
 *
 * Lot : PREHEADER-HERO-1 / PRODUCT-PREHEADER-REFINE-1 / PRODUCT-HOOK-AND-STRUCTURE-1 / PRODUCT-HERO-WOW-POLISH-3
 */
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProductPreHeaderSectionProps = {
  productName: string;
  isSimpleProduct: boolean;
  marketingHook?: string | null;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductPreHeaderSection({
  marketingHook,
}: ProductPreHeaderSectionProps) {
  if (!marketingHook) {
    return null;
  }

  return (
    <div className="px-1 pb-6 min-[700px]:pb-8">
      <p className="max-w-[56ch] border-l-2 border-brand/35 pl-3 font-serif text-secondary-copy reading-relaxed font-medium text-foreground min-[900px]:text-lg min-[1200px]:max-w-[58ch]">
        {marketingHook}
      </p>
    </div>
  );
}
