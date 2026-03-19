import type { SimpleProductOffer } from "@/entities/product/simple-product-offer";

export type DbId = string;
export type MoneyAmount = string;

export type FeaturedCategory = {
  id: DbId;
  name: string;
  slug: string;
  description: string | null;
  representativeImage: { filePath: string; altText: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

export type CatalogFilterCategory = {
  id: DbId;
  name: string;
  slug: string;
};

export type PublishedProductListFilters = {
  searchQuery: string | null;
  categorySlug: string | null;
  onlyAvailable: boolean;
};

export type PublishedProductImage = {
  id: DbId;
  productId: DbId;
  variantId: DbId | null;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublishedProductSummary = {
  id: DbId;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  productType: "simple" | "variable";
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  primaryImage: PublishedProductImage | null;
};

export type PublishedCatalogProductSummary = PublishedProductSummary & {
  isAvailable: boolean;
  simpleOffer: SimpleProductOffer | null;
};

export type PublishedProductVariant = {
  id: DbId;
  productId: DbId;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: MoneyAmount;
  compareAtPrice: MoneyAmount | null;
  stockQuantity: number;
  isDefault: boolean;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  images: PublishedProductImage[];
};

export type PublishedProductDetail = PublishedProductSummary & {
  isAvailable: boolean;
  simpleOffer: SimpleProductOffer | null;
  images: PublishedProductImage[];
  variants: PublishedProductVariant[];
};

export type PublishedBlogPostSummary = {
  id: DbId;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImagePath: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublishedBlogPostDetail = PublishedBlogPostSummary & {
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PublishedHomepageContent = {
  id: DbId;
  heroTitle: string | null;
  heroText: string | null;
  heroImagePath: string | null;
  editorialTitle: string | null;
  editorialText: string | null;
  createdAt: string;
  updatedAt: string;
  featuredProducts: PublishedProductSummary[];
  featuredCategories: FeaturedCategory[];
  featuredBlogPosts: PublishedBlogPostSummary[];
};
