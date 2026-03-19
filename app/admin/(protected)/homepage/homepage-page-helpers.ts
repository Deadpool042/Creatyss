import type {
  AdminHomepageFeaturedBlogPostSelection,
  AdminHomepageFeaturedCategorySelection,
  AdminHomepageFeaturedProductSelection,
} from "@/db/repositories/admin-homepage.repository";
import {
  HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH,
  HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH,
  HOMEPAGE_FEATURED_BLOG_POSTS_MAX_COUNT,
  HOMEPAGE_FEATURED_CATEGORIES_MAX_COUNT,
  HOMEPAGE_FEATURED_PRODUCTS_MAX_COUNT,
  HOMEPAGE_HERO_TEXT_MAX_LENGTH,
  HOMEPAGE_HERO_TITLE_MAX_LENGTH,
} from "@/entities/homepage/homepage-input";

export type HomepageSearchParams = Record<string, string | string[] | undefined>;

export function readHomepageSearchParam(
  searchParams: HomepageSearchParams,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getHomepageStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Page d'accueil enregistrée avec succès.";
    default:
      return null;
  }
}

export function getHomepageErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_homepage":
      return "La page d'accueil publiée est introuvable.";
    case "invalid_hero_image":
      return "La sélection de l'image principale est invalide.";
    case "hero_media_missing":
      return "Le média sélectionné pour l'image principale est introuvable.";
    case "hero_title_too_long":
      return `Le titre principal ne doit pas dépasser ${HOMEPAGE_HERO_TITLE_MAX_LENGTH} caractères.`;
    case "hero_text_too_long":
      return `Le texte principal ne doit pas dépasser ${HOMEPAGE_HERO_TEXT_MAX_LENGTH} caractères.`;
    case "editorial_title_too_long":
      return `Le titre éditorial ne doit pas dépasser ${HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH} caractères.`;
    case "editorial_text_too_long":
      return `Le texte éditorial ne doit pas dépasser ${HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH} caractères.`;
    case "invalid_product_selection":
      return "La sélection des produits mis en avant est invalide.";
    case "invalid_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_product_sort_order":
      return "Chaque produit mis en avant doit avoir un ordre unique.";
    case "too_many_featured_products":
      return `Vous ne pouvez pas sélectionner plus de ${HOMEPAGE_FEATURED_PRODUCTS_MAX_COUNT} produits mis en avant.`;
    case "product_missing":
      return "Au moins un produit mis en avant est introuvable ou n'est plus publié.";
    case "invalid_category_selection":
      return "La sélection des catégories mises en avant est invalide.";
    case "invalid_category_sort_order":
      return "Chaque catégorie mise en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_category_sort_order":
      return "Chaque catégorie mise en avant doit avoir un ordre unique.";
    case "too_many_featured_categories":
      return `Vous ne pouvez pas sélectionner plus de ${HOMEPAGE_FEATURED_CATEGORIES_MAX_COUNT} catégories mises en avant.`;
    case "category_missing":
      return "Au moins une catégorie mise en avant est introuvable.";
    case "invalid_blog_post_selection":
      return "La sélection des articles mis en avant est invalide.";
    case "invalid_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre entier positif ou nul.";
    case "duplicate_blog_post_sort_order":
      return "Chaque article mis en avant doit avoir un ordre unique.";
    case "too_many_featured_blog_posts":
      return `Vous ne pouvez pas sélectionner plus de ${HOMEPAGE_FEATURED_BLOG_POSTS_MAX_COUNT} articles mis en avant.`;
    case "blog_post_missing":
      return "Au moins un article mis en avant est introuvable ou n'est plus publié.";
    case "save_failed":
      return "La page d'accueil n'a pas pu être enregistrée.";
    default:
      return null;
  }
}

export function buildProductSelectionMap(
  selections: readonly AdminHomepageFeaturedProductSelection[]
): Map<string, number> {
  return new Map(selections.map((selection) => [selection.productId, selection.sortOrder]));
}

export function buildCategorySelectionMap(
  selections: readonly AdminHomepageFeaturedCategorySelection[]
): Map<string, number> {
  return new Map(selections.map((selection) => [selection.categoryId, selection.sortOrder]));
}

export function buildBlogPostSelectionMap(
  selections: readonly AdminHomepageFeaturedBlogPostSelection[]
): Map<string, number> {
  return new Map(selections.map((selection) => [selection.blogPostId, selection.sortOrder]));
}

export function getHomepageImageUrl(
  uploadsPublicPath: string,
  filePath: string | null
): string | null {
  if (typeof filePath !== "string") {
    return null;
  }

  const normalizedFilePath = filePath.trim().replace(/^\/+/, "");

  if (normalizedFilePath.length === 0) {
    return null;
  }

  return `${uploadsPublicPath}/${normalizedFilePath}`;
}
