// features/storefront/catalog/boutique-page/components/header/boutique-page-header.tsx

type BoutiquePageHeaderProps = {
  productCountLabel: string;
  activeCategoryName: string | null;
};

export function BoutiquePageHeader({
  productCountLabel,
  activeCategoryName,
}: BoutiquePageHeaderProps) {
  const description = activeCategoryName
    ? `Catégorie active : ${activeCategoryName}`
    : "Découvrez nos créations faites main avec passion.";

  return (
    <section className="boutique-page-header-shell">
      <div className="boutique-mobile-portrait">
        <div
          className="boutique-hero-card boutique-hero-card-compact"
          data-testid="boutique-mobile-hero"
        >
          <div className="boutique-hero-content">
            <p className="m-0 text-xs font-medium uppercase tracking-wide text-brand/90">
              Collection Creatyss
            </p>
            <h1 className="m-0">Boutique</h1>
            <p className="m-0 text-sm leading-relaxed text-text-muted-strong">{description}</p>
            <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>
      </div>

      <div className="boutique-mobile-landscape">
        <div className="boutique-landscape-context-bar" data-testid="boutique-landscape-hero">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="m-0 text-xs font-medium uppercase tracking-wide text-brand/90">
                Collection Creatyss
              </p>
              <h1 className="m-0 text-xl leading-tight">Boutique</h1>
            </div>
            <p className="m-0 shrink-0 text-xs text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
