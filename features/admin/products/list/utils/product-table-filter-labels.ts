import type {
  ProductTableFeaturedFilter,
  ProductTableImageFilter,
  ProductTableSortOption,
  ProductTableStatusFilter,
  ProductTableStockFilter,
  ProductTableVariantFilter,
} from "@/features/admin/products/list/schemas/product-table-filters.schema";

export function getStatusLabel(status: ProductTableStatusFilter): string {
  switch (status) {
    case "published":
      return "Publié";
    case "draft":
      return "Brouillon";
    case "archived":
      return "Archivé";
    default:
      return "Tous les statuts";
  }
}

export function getFeaturedLabel(value: ProductTableFeaturedFilter): string {
  switch (value) {
    case "featured":
      return "Mis en avant";
    case "standard":
      return "Produits standards";
    default:
      return "Tous les produits";
  }
}

export function getImageLabel(value: ProductTableImageFilter): string {
  switch (value) {
    case "with-image":
      return "Avec image";
    case "without-image":
      return "Sans image";
    default:
      return "Toutes les images";
  }
}

export function getVariantLabel(value: ProductTableVariantFilter): string {
  switch (value) {
    case "with-variants":
      return "Avec variantes";
    case "without-variants":
      return "Sans variantes";
    case "single-variant":
      return "1 variante";
    case "multi-variant":
      return "Plusieurs variantes";
    default:
      return "Toutes les variantes";
  }
}

export function getStockLabel(value: ProductTableStockFilter): string {
  switch (value) {
    case "in-stock":
      return "En stock";
    case "low-stock":
      return "Stock faible";
    case "out-of-stock":
      return "Rupture";
    default:
      return "Tous les stocks";
  }
}

export function getSortLabel(value: ProductTableSortOption): string {
  switch (value) {
    case "name-asc":
      return "Nom A → Z";
    case "name-desc":
      return "Nom Z → A";
    case "price-asc":
      return "Prix croissant";
    case "price-desc":
      return "Prix décroissant";
    default:
      return "Plus récents";
  }
}
