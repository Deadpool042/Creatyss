type ProductHeroImageCounterOverlayProps = {
  activeIndex: number;
  total: number;
  className: string;
};

type ProductHeroMediaEmptyStateProps = {
  className: string;
};

export function ProductHeroImageCounterOverlay({
  activeIndex,
  total,
  className,
}: ProductHeroImageCounterOverlayProps) {
  if (total <= 1) {
    return null;
  }

  return (
    <div className={["absolute rounded-full bg-background/70 backdrop-blur-sm", className].join(" ")}>
      <span className="text-micro-copy tabular-nums text-foreground">
        {activeIndex + 1} / {total}
      </span>
    </div>
  );
}

export function ProductHeroMediaEmptyState({ className }: ProductHeroMediaEmptyStateProps) {
  return (
    <div
      className={[
        "grid place-items-center border border-dashed border-hero-border text-center text-sm text-media-foreground",
        className,
      ].join(" ")}
    >
      Aucune image.
    </div>
  );
}
