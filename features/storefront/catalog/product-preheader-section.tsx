/**
 * Bloc pré-header éditorial — fiche produit.
 *
 * Accroche minimale avant le hero transactionnel : badge type · nom produit · accroche commerciale.
 * Sobre, sans carte, aligné à gauche — iOS/macOS-like.
 * Partagé storefront + preview admin via product-page-template.
 *
 * Lot : PREHEADER-HERO-1 / PRODUCT-PREHEADER-REFINE-1 / PRODUCT-HOOK-AND-STRUCTURE-1
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
    <div className="grid gap-3 px-1">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{isSimpleProduct ? "Simple" : "Variable"}</Badge>
      </div>
      <h1 className="m-0 text-3xl font-bold leading-tight tracking-tight min-[700px]:text-4xl">
        {productName}
      </h1>
      {marketingHook ? (
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{marketingHook}</p>
      ) : null}
    </div>
  );
}
