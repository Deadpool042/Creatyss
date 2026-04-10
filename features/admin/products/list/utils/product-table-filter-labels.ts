import type {
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
} from "../types";

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
    case "low-stock":
      return "Stock faible";
  }
}

export function getVariantLabel(value: ProductFilterVariantOption): string {
  switch (value) {
    case "all":
      return "Toutes";
    case "single":
      return "Simple";
    case "multiple":
      return "Multiple";
    case "with-variants":
      return "Avec variantes";
    case "without-variants":
      return "Sans variantes";
    case "single-variant":
      return "Variante unique";
    case "multi-variant":
      return "Variantes multiples";
  }
}

export function getSortLabel(value: ProductSortOption): string {
  switch (value) {
    case "updated-desc":
      return "Modif. récentes";
    case "updated-asc":
      return "Modif. anciennes";
    case "created-desc":
      return "Création récente";
    case "created-asc":
      return "Création ancienne";
    case "name-asc":
      return "Nom A-Z";
    case "name-desc":
      return "Nom Z-A";
    case "price-asc":
      return "Prix croissant";
    case "price-desc":
      return "Prix décroissant";
  }
}

export function getStatusLabel(value: "draft" | "active" | "inactive" | "archived" | "published"): string {
  switch (value) {
    case "draft":
      return "Brouillon";
    case "active":
      return "Actif";
    case "inactive":
      return "Inactif";
    case "archived":
      return "Archivé";
    case "published":
      return "Publié";
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
