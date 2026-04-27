// features/storefront/catalog/components/product-hero-thumbnail-button.tsx
import Image from "next/image";

export type HeroImage = {
  src: string;
  alt: string | null;
};

type HeroThumbnailButtonProps = {
  image: HeroImage;
  index: number;
  productName: string;
  isActive: boolean;
  onSelect: (index: number) => void;
};

export function HeroThumbnailButton({
  image,
  index,
  productName,
  isActive,
  onSelect,
}: HeroThumbnailButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Voir l'image ${index + 1} du produit`}
      aria-pressed={isActive}
      onClick={() => onSelect(index)}
      className={[
        "group relative w-14 min-w-14 overflow-hidden rounded-lg border p-px transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/35",
        isActive
          ? "border-brand/60 bg-interactive-selected shadow-card"
          : "border-hero-border bg-transparent opacity-80 hover:border-brand/40 hover:bg-hero-bg hover:opacity-100",
      ].join(" ")}
    >
      <Image
        src={image.src}
        alt={image.alt ?? `${productName} miniature ${index + 1}`}
        width={200}
        height={200}
        loading="lazy"
        sizes="(min-width: 1024px) 4vw, 12vw"
        className="aspect-square w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </button>
  );
}
