import type {
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableStatus,
} from "../types/product-table.types";

export function getFeaturedLabel(value: ProductFilterFeaturedOption): string {
  switch (value) {
    case "all":
      return "Tous";
    case "featured":
      return "Mis en avant";
    case "standard":
      return "Standard";
  }
}

export function getImageLabel(value: ProductFilterImageOption): string {
  switch (value) {
    case "all":
      return "Toutes";
    case "with-image":
      return "Avec image";
    case "without-image":
      return "Sans image";
  }
}

export function getStockLabel(value: ProductFilterStockOption): string {
  switch (value) {
    case "all":
      return "Tous";
    case "in-stock":
      return "En stock";
    case "out-of-stock":
      return "Rupture";
  }
}

export function getVariantLabel(value: ProductFilterVariantOption): string {
  switch (value) {
    case "all":
      return "Tous";
    case "single":
      return "Simple";
    case "multiple":
      return "Multi-variantes";
  }
}

export function getSortLabel(value: ProductSortOption): string {
  switch (value) {
    case "updated-desc":
      return "Plus récents";
    case "updated-asc":
      return "Plus anciens";
    case "name-asc":
      return "Nom A → Z";
    case "name-desc":
      return "Nom Z → A";
  }
}

export function getStatusLabel(value: ProductTableStatus): string {
  switch (value) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "archived":
      return "Archivé";
  }
}

export function parsePriceValue(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const normalized = value.replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export function stripHtml(value: string | null): string {
  if (!value) {
    return "";
  }

  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
