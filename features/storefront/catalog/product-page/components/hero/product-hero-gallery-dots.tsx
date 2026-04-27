type ProductHeroGalleryDotsProps = {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ProductHeroGalleryDots({
  total,
  activeIndex,
  onSelect,
}: ProductHeroGalleryDotsProps) {
  if (total <= 1) {
    return null;
  }

  return (
    <div
      aria-label="Pagination de la galerie produit"
      className="flex items-center justify-center gap-2 px-6 py-3"
    >
      {Array.from({ length: total }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={index}
            type="button"
            aria-label={`Voir l'image ${index + 1} du produit`}
            aria-pressed={isActive}
            onClick={() => onSelect(index)}
            className={[
              "rounded-full border transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
              isActive
                ? "h-2 w-5 border-control-border-strong bg-interactive-selected"
                : "h-2 w-2 border-control-border bg-surface-panel hover:bg-interactive-hover",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
