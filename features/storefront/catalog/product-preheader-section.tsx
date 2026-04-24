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
  productName,
  isSimpleProduct,
  marketingHook,
}: ProductPreHeaderSectionProps) {
  return (
    <div className="grid gap-3.5 px-1 min-[700px]:gap-4.5">
      {/* Type produit — overline utile (signal de structure), plus sobre qu'un badge décoratif */}
      <p className="m-0 text-meta-label text-muted-foreground">
        {isSimpleProduct ? "Produit simple" : "Produit à déclinaisons"}
      </p>

      {/* Titre — gap réduit après le badge (badge = indicateur, pas bloc majeur) */}
      <h1 className="m-0 text-title-page">{productName}</h1>

      {/* marketingHook — légèrement écarté du titre pour marquer la séparation
          entre identité produit (titre) et promesse commerciale (accroche) */}
      {marketingHook ? (
        <p className="mt-1 max-w-[56ch] border-l-2 border-brand/35 pl-3 font-serif text-secondary-copy reading-relaxed font-medium text-foreground min-[900px]:text-lg min-[1200px]:max-w-[58ch]">
          {marketingHook}
        </p>
      ) : null}
    </div>
  );
}
