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
  shortDescription?: string | null;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductPreHeaderSection({
  productName,
  isSimpleProduct,
  marketingHook,
  shortDescription,
}: ProductPreHeaderSectionProps) {
  return (
    <div className="grid gap-2 px-1 min-[700px]:gap-3">
      {/* Type produit — overline utile (signal de structure), plus sobre qu'un badge décoratif */}
      <p className="m-0 text-eyebrow text-muted-foreground">
        {isSimpleProduct ? "Produit simple" : "Produit à déclinaisons"}
      </p>

      {/* Titre — gap réduit après le badge (badge = indicateur, pas bloc majeur) */}
      <h1 className="m-0 text-3xl font-bold leading-tight tracking-tight min-[700px]:text-4xl min-[900px]:text-[2.65rem]">
        {productName}
      </h1>

      {/* marketingHook — légèrement écarté du titre pour marquer la séparation
          entre identité produit (titre) et promesse commerciale (accroche) */}
      {marketingHook ? (
        <p className="mt-1 max-w-[50ch] border-l-2 border-brand/35 pl-3 font-serif text-lg font-medium leading-snug text-foreground min-[900px]:text-xl">
          {marketingHook}
        </p>
      ) : null}

      {shortDescription ? (
        <div
          className="prose prose-sm dark:prose-invert mt-1 max-w-[56ch] text-foreground min-[900px]:prose-base [&_p]:my-0 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />
      ) : null}
    </div>
  );
}
