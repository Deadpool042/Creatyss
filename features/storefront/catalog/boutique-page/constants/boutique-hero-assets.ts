//features/storefront/catalog/boutique-page/constants/boutique-hero-assets.ts
export type BoutiqueHeroTheme = "light" | "dark";

export type BoutiqueHeroVariant =
  | "mobilePortrait"
  | "tablet"
  | "desktop"
  | "ultrawide"
  | "sourceOptimized"
  | "blurPlaceholder";

export type BoutiqueHeroAsset = Readonly<{
  src: string;
  width: number;
  height: number;
}>;

export type BoutiqueHeroAssetSet = Readonly<Record<BoutiqueHeroVariant, BoutiqueHeroAsset>>;

export const BOUTIQUE_HERO_ASSETS: Readonly<Record<BoutiqueHeroTheme, BoutiqueHeroAssetSet>> = {
  light: {
    mobilePortrait: {
      src: "/images/storefront/boutique/hero/boutique-hero-light-mobile-portrait-1200x1600.webp",
      width: 1200,
      height: 1600,
    },
    tablet: {
      src: "/images/storefront/boutique/hero/boutique-hero-light-tablet-1800x1000.webp",
      width: 1800,
      height: 1000,
    },
    desktop: {
      src: "/images/storefront/boutique/hero/boutique-hero-light-desktop-2400x900.webp",
      width: 2400,
      height: 900,
    },
    ultrawide: {
      src: "/images/storefront/boutique/hero/boutique-hero-light-ultrawide-3200x1200.webp",
      width: 3200,
      height: 1200,
    },
    sourceOptimized: {
      src: "/images/storefront/boutique/hero/boutique-hero-light-source-optimized-1536x1024.webp",
      width: 1536,
      height: 1024,
    },
    blurPlaceholder: {
      src: "/images/storefront/boutique/hero/boutique-hero-light-blur-placeholder-64x40.webp",
      width: 64,
      height: 40,
    },
  },
  dark: {
    mobilePortrait: {
      src: "/images/storefront/boutique/hero/boutique-hero-dark-mobile-portrait-1200x1600.webp",
      width: 1200,
      height: 1600,
    },
    tablet: {
      src: "/images/storefront/boutique/hero/boutique-hero-dark-tablet-1800x1000.webp",
      width: 1800,
      height: 1000,
    },
    desktop: {
      src: "/images/storefront/boutique/hero/boutique-hero-dark-desktop-2400x900.webp",
      width: 2400,
      height: 900,
    },
    ultrawide: {
      src: "/images/storefront/boutique/hero/boutique-hero-dark-ultrawide-3200x1200.webp",
      width: 3200,
      height: 1200,
    },
    sourceOptimized: {
      src: "/images/storefront/boutique/hero/boutique-hero-dark-source-optimized-1536x1024.webp",
      width: 1536,
      height: 1024,
    },
    blurPlaceholder: {
      src: "/images/storefront/boutique/hero/boutique-hero-dark-blur-placeholder-64x40.webp",
      width: 64,
      height: 40,
    },
  },
} as const;
