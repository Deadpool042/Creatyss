type ProductHeroHeaderDensity = "compact" | "cozy" | "default";

type ProductHeroHeaderProps = {
  productName: string;
  marketingHook: string | null;
  isSimpleProduct: boolean;
  density?: ProductHeroHeaderDensity;
};

function getHeaderGapClass(density: ProductHeroHeaderDensity): string {
  if (density === "compact") {
    return "gap-1";
  }

  if (density === "cozy") {
    return "gap-2";
  }

  return "gap-2.5";
}

function getMarketingHookClass(density: ProductHeroHeaderDensity): string {
  if (density === "compact") {
    return "max-w-xl pl-3 text-sm";
  }

  return "max-w-2xl pl-4 text-secondary-copy";
}

export function ProductHeroHeader({
  productName,
  marketingHook,
  isSimpleProduct,
  density = "default",
}: ProductHeroHeaderProps) {
  return (
    <header className={["grid", getHeaderGapClass(density)].join(" ")}>
      <p className="text-meta-label text-brand">{isSimpleProduct ? "Pièce unique" : "Édition unique"}</p>

      <h1 className="text-title-page text-foreground">{productName}</h1>

      {marketingHook ? (
        <p
          className={[
            "border-l-2 border-brand/35 reading-relaxed text-foreground-muted",
            getMarketingHookClass(density),
          ].join(" ")}
        >
          {marketingHook}
        </p>
      ) : null}
    </header>
  );
}
