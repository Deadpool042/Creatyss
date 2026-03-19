import { type AdminMediaAsset } from "@/db/admin-media";
import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";

import {
  type PrimaryImageScope,
  type PrimaryImageState,
  type ProductDetailSearchParams,
} from "../types/product-detail-types";

export function readProductDetailSearchParam(
  searchParams: ProductDetailSearchParams,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getProductStatusLabel(status: "draft" | "published"): string {
  return status === "published" ? "Publié" : "Brouillon";
}

export function getProductStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Produit créé avec succès.";
    case "updated":
      return "Produit mis à jour avec succès.";
    default:
      return null;
  }
}

export function getProductErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_name":
      return "Le nom du produit est obligatoire.";
    case "missing_slug":
      return "Le slug du produit est obligatoire.";
    case "invalid_slug":
      return "Renseignez un slug produit valide.";
    case "invalid_status":
      return "Le statut du produit est invalide.";
    case "invalid_product_type":
      return "Le type de produit est invalide.";
    case "invalid_category_ids":
      return "Une ou plusieurs catégories sélectionnées sont invalides.";
    case "slug_taken":
      return "Ce slug est déjà utilisé par un autre produit.";
    case "simple_product_requires_single_variant":
      return "Un produit simple ne peut avoir qu'une seule déclinaison.";
    case "simple_product_incoherent_variants":
      return "Ce produit simple a plusieurs déclinaisons et ne peut pas être publié. Corrigez d'abord la configuration dans la section Vente.";
    case "save_failed":
      return "Le produit n'a pas pu être enregistré.";
    default:
      return null;
  }
}

export function getVariantStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Déclinaison créée avec succès.";
    case "updated":
      return "Déclinaison mise à jour avec succès.";
    case "deleted":
      return "Déclinaison supprimée avec succès.";
    default:
      return null;
  }
}

export function getSimpleOfferStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "updated":
      return "Les informations de vente ont été mises à jour avec succès.";
    default:
      return null;
  }
}

export function getSimpleOfferErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_sku":
      return "Le SKU est obligatoire.";
    case "missing_price":
      return "Le prix est obligatoire.";
    case "invalid_price":
      return "Renseignez un prix valide.";
    case "invalid_compare_at_price":
      return "Renseignez un prix barré valide.";
    case "compare_at_price_below_price":
      return "Le prix barré doit être supérieur ou égal au prix.";
    case "missing_stock_quantity":
      return "Le stock disponible est obligatoire.";
    case "invalid_stock_quantity":
      return "Renseignez un stock disponible entier positif ou nul.";
    case "sku_taken":
      return "Cette référence est déjà utilisée par une autre déclinaison.";
    case "simple_product_offer_requires_simple_product":
      return "Cette édition est réservée aux produits simples.";
    case "simple_product_multiple_legacy_variants":
      return "Ce produit simple est incohérent car plusieurs déclinaisons sont encore associées. Corrigez d'abord cet état dans les données existantes avant de modifier les informations de vente.";
    case "save_failed":
      return "Les informations de vente n'ont pas pu être enregistrées.";
    default:
      return null;
  }
}

export function getVariantErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_variant":
      return "La déclinaison demandée est introuvable.";
    case "missing_variant_name":
      return "Le nom de la déclinaison est obligatoire.";
    case "missing_color_name":
      return "Le nom de couleur est obligatoire.";
    case "invalid_color_hex":
      return "Renseignez un code couleur hexadécimal valide.";
    case "missing_sku":
      return "Le SKU est obligatoire.";
    case "missing_price":
      return "Le prix est obligatoire.";
    case "invalid_price":
      return "Renseignez un prix valide.";
    case "invalid_compare_at_price":
      return "Renseignez un prix barré valide.";
    case "compare_at_price_below_price":
      return "Le prix barré doit être supérieur ou égal au prix.";
    case "missing_stock_quantity":
      return "Le stock disponible est obligatoire.";
    case "invalid_stock_quantity":
      return "Renseignez un stock disponible entier positif ou nul.";
    case "invalid_variant_status":
      return "Le statut de la déclinaison est invalide.";
    case "sku_taken":
      return "Cette référence est déjà utilisée par une autre déclinaison.";
    case "simple_product_single_variant_only":
      return "Un produit simple ne peut avoir qu'une seule déclinaison.";
    case "simple_product_requires_sellable_variant":
      return "Un produit simple doit conserver sa déclinaison existante unique.";
    case "save_failed":
      return "La déclinaison n'a pas pu être enregistrée.";
    case "delete_failed":
      return "La déclinaison n'a pas pu être supprimée.";
    default:
      return null;
  }
}

export function getAvailabilityLabel(isAvailable: boolean): string {
  return isAvailable ? "Disponible" : "Temporairement indisponible";
}

export function getDetailSellableCountLabel(input: {
  productType: "simple" | "variable";
  variantCount: number;
  simpleOffer: {
    sku: string;
    price: string;
    compareAtPrice: string | null;
    stockQuantity: number;
    isAvailable: boolean;
  } | null;
  fallbackLabel: string;
}): string {
  if (input.productType !== "simple") {
    return input.fallbackLabel;
  }

  if (input.variantCount > 1) {
    return "État à vérifier";
  }

  if (input.simpleOffer !== null) {
    return "Informations de vente prêtes";
  }

  return input.variantCount === 0
    ? "Informations de vente à compléter"
    : "Informations de vente à vérifier";
}

export function getImageStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "created":
      return "Image enregistrée avec succès.";
    case "updated":
      return "Image mise à jour avec succès.";
    case "deleted":
      return "Image supprimée avec succès.";
    case "primary_updated":
      return "Image principale enregistrée avec succès.";
    case "primary_deleted":
      return "Image principale supprimée avec succès.";
    default:
      return null;
  }
}

export function getImageErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_media_asset":
      return "Sélectionnez un média existant.";
    case "invalid_media_asset":
      return "Le média sélectionné est invalide.";
    case "invalid_variant":
      return "La déclinaison sélectionnée est invalide.";
    case "invalid_sort_order":
      return "Le tri d'image doit être un entier positif ou nul.";
    case "media_missing":
      return "Le média sélectionné est introuvable.";
    case "variant_missing":
      return "La déclinaison sélectionnée n'appartient pas à ce produit.";
    case "missing_image":
      return "L'image demandée est introuvable.";
    case "save_failed":
      return "L'image n'a pas pu être enregistrée.";
    case "delete_failed":
      return "L'image n'a pas pu être supprimée.";
    default:
      return null;
  }
}

export function getDeleteErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "referenced":
      return "Ce produit ne peut pas être supprimé car il est encore référencé ailleurs.";
    case "delete_failed":
      return "Le produit n'a pas pu être supprimé.";
    default:
      return null;
  }
}

export function getImageUrl(uploadsPublicPath: string, filePath: string | null): string | null {
  if (typeof filePath !== "string") {
    return null;
  }

  const normalizedFilePath = filePath.trim().replace(/^\/+/, "");

  if (normalizedFilePath.length === 0) {
    return null;
  }

  return `${uploadsPublicPath}/${normalizedFilePath}`;
}

export function groupVariantImages(images: AdminProductImage[]): Map<string, AdminProductImage[]> {
  const groupedImages = new Map<string, AdminProductImage[]>();

  for (const image of images) {
    if (image.variantId === null) {
      continue;
    }

    const existingImages = groupedImages.get(image.variantId) ?? [];
    existingImages.push(image);
    groupedImages.set(image.variantId, existingImages);
  }

  return groupedImages;
}

export function getPrimaryImageState(images: AdminProductImage[]): PrimaryImageState {
  const primaryImage = images.find((image) => image.isPrimary) ?? null;
  const displayImage = primaryImage ?? images[0] ?? null;

  return {
    primaryImage,
    displayImage,
    extraImageCount: displayImage === null ? 0 : Math.max(images.length - 1, 0),
    usesFallbackImage: primaryImage === null && displayImage !== null,
  };
}

export function getPrimaryImageEmptyMessage(scope: PrimaryImageScope): string {
  return scope === "product"
    ? "Aucune image principale définie pour ce produit."
    : "Aucune image principale définie pour cette déclinaison.";
}

export function getPrimaryImageFallbackMessage(scope: PrimaryImageScope): string {
  return scope === "product"
    ? "Aucune image principale du produit n'est encore définie. Une image existante reste associée au produit, mais elle n'est pas encore marquée comme principale."
    : "Aucune image principale n'est encore définie pour cette déclinaison. Une image existante reste associée, sans être marquée comme principale.";
}

export function getPrimaryImageExtraImagesMessage(
  scope: PrimaryImageScope,
  extraImageCount: number
): string {
  const scopeLabel = scope === "product" ? "ce produit" : "cette déclinaison";
  const imageLabel = extraImageCount > 1 ? "images" : "image";
  const extraLabel = extraImageCount > 1 ? "supplémentaires restent" : "supplémentaire reste";
  const associationLabel = extraImageCount > 1 ? "associées" : "associée";

  return `${extraImageCount} ${imageLabel} ${extraLabel} ${associationLabel} à ${scopeLabel}. Les réglages complémentaires restent disponibles plus bas.`;
}

export function getPrimaryImageSubmitLabel(hasPrimaryImage: boolean): string {
  return hasPrimaryImage ? "Remplacer l'image principale" : "Définir l'image principale";
}

export function findMediaAssetByFilePath(
  mediaAssets: AdminMediaAsset[],
  filePath: string | null
): AdminMediaAsset | null {
  if (typeof filePath !== "string") {
    return null;
  }

  return mediaAssets.find((mediaAsset) => mediaAsset.filePath === filePath) ?? null;
}

export function isCategoryAssigned(
  assignedCategoryIds: readonly string[],
  categoryId: string
): boolean {
  return assignedCategoryIds.includes(categoryId);
}

export function getSimpleOfferFormDefaults(product: {
  simpleOfferFields: {
    sku: string | null;
    price: string | null;
    compareAtPrice: string | null;
    stockQuantity: number | null;
  };
  simpleOffer: {
    sku: string;
    price: string;
    compareAtPrice: string | null;
    stockQuantity: number;
    isAvailable: boolean;
  } | null;
}) {
  return {
    sku: product.simpleOfferFields.sku ?? product.simpleOffer?.sku ?? "",
    price: product.simpleOfferFields.price ?? product.simpleOffer?.price ?? "",
    compareAtPrice:
      product.simpleOfferFields.compareAtPrice ?? product.simpleOffer?.compareAtPrice ?? "",
    stockQuantity: String(
      product.simpleOfferFields.stockQuantity ?? product.simpleOffer?.stockQuantity ?? 0
    ),
  };
}
