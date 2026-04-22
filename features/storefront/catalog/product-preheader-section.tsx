/**
 * Bloc pré-header éditorial — fiche produit.
 *
 * Accroche minimale avant le hero transactionnel : badge type · nom produit · accroche commerciale.
 * Sobre, sans carte, aligné à gauche — iOS/macOS-like.
 * Partagé storefront + preview admin via product-page-template.
 *
 * Lot : PREHEADER-HERO-1 / PRODUCT-PREHEADER-REFINE-1 / PRODUCT-HOOK-AND-STRUCTURE-1 / PRODUCT-HERO-WOW-POLISH-3
 */
import { Badge } from "@/components/ui/badge";

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
    <div className="grid gap-2.5 px-1 min-[700px]:gap-3">
      {/* Badge — teinté brand pour ancrer l'identité artisanale */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="border-brand/40 bg-brand/[0.07] text-brand"
        >
          {isSimpleProduct ? "Simple" : "Variable"}
        </Badge>
      </div>

      {/* Titre — gap réduit après le badge (badge = indicateur, pas bloc majeur) */}
      <h1 className="m-0 -mt-1 text-3xl font-bold leading-tight tracking-tight min-[700px]:text-4xl min-[900px]:text-[2.65rem]">
        {productName}
      </h1>

      {/* marketingHook — légèrement écarté du titre pour marquer la séparation
          entre identité produit (titre) et promesse commerciale (accroche) */}
      {marketingHook ? (
        <p className="mt-0.5 max-w-3xl border-l-[2px] border-brand/50 pl-3 font-serif text-base font-light leading-relaxed text-hero-ink-soft min-[700px]:text-lg">
          {marketingHook}
        </p>
      ) : null}
    </div>
  );
}
