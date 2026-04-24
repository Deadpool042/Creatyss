"use server";

import { refresh } from "next/cache";
import { validateAdminProductVariantInput } from "@/entities/product";
import {
  productVariantFormInitialState,
  type ProductVariantFormAction,
} from "../types/product-variants.types";
import {
  AdminProductEditorServiceError,
  updateProductVariant,
} from "../services";
import type { AdminProductVariantInputErrorCode } from "@/entities/product/admin-product-variant-input";

function getField(formData: FormData, key: string): FormDataEntryValue | null {
  return formData.get(key);
}

function mapValidationError(code: AdminProductVariantInputErrorCode) {
  switch (code) {
    case "missing_sku":
      return {
        message: "Le SKU est requis.",
        fieldErrors: { sku: "Renseignez un SKU." },
      } as const;
    case "invalid_slug":
      return {
        message: "Le slug est invalide.",
        fieldErrors: { slug: "Renseignez un slug valide (ou laissez le champ vide)." },
      } as const;
    case "invalid_primary_image":
      return {
        message: "L'image principale est invalide.",
        fieldErrors: { primaryImageId: "Sélectionnez une image valide, ou laissez vide." },
      } as const;
    case "invalid_status":
      return {
        message: "Le statut est invalide.",
        fieldErrors: { status: "Sélectionnez un statut valide." },
      } as const;
    case "invalid_sort_order":
      return {
        message: "L'ordre est invalide.",
        fieldErrors: { sortOrder: "Renseignez un ordre (nombre entier >= 0)." },
      } as const;
    case "invalid_weight_grams":
      return {
        message: "Le poids est invalide.",
        fieldErrors: { weightGrams: "Renseignez un poids (nombre entier >= 0), ou laissez vide." },
      } as const;
    case "invalid_width_mm":
      return {
        message: "La largeur est invalide.",
        fieldErrors: { widthMm: "Renseignez une largeur (nombre entier >= 0), ou laissez vide." },
      } as const;
    case "invalid_height_mm":
      return {
        message: "La hauteur est invalide.",
        fieldErrors: { heightMm: "Renseignez une hauteur (nombre entier >= 0), ou laissez vide." },
      } as const;
    case "invalid_depth_mm":
      return {
        message: "La profondeur est invalide.",
        fieldErrors: { depthMm: "Renseignez une profondeur (nombre entier >= 0), ou laissez vide." },
      } as const;
  }
}

export const updateProductVariantAction: ProductVariantFormAction = async (
  _prevState,
  formData
) => {
  const productIdValue = getField(formData, "productId");
  const variantIdValue = getField(formData, "variantId");

  if (
    typeof productIdValue !== "string" ||
    productIdValue.trim().length === 0 ||
    typeof variantIdValue !== "string" ||
    variantIdValue.trim().length === 0
  ) {
    return {
      ...productVariantFormInitialState,
      status: "error",
      message: "Variante introuvable.",
    };
  }

  const validated = validateAdminProductVariantInput({
    sku: getField(formData, "sku"),
    slug: getField(formData, "slug"),
    name: getField(formData, "name"),
    primaryImageMediaAssetId: getField(formData, "primaryImageId"),
    status: getField(formData, "status"),
    isDefault: getField(formData, "isDefault"),
    sortOrder: getField(formData, "sortOrder"),
    barcode: getField(formData, "barcode"),
    externalReference: getField(formData, "externalReference"),
    weightGrams: getField(formData, "weightGrams"),
    widthMm: getField(formData, "widthMm"),
    heightMm: getField(formData, "heightMm"),
    depthMm: getField(formData, "depthMm"),
  });

  if (!validated.ok) {
    const mapped = mapValidationError(validated.code);
    return {
      ...productVariantFormInitialState,
      status: "error",
      message: mapped.message,
      fieldErrors: mapped.fieldErrors,
    };
  }

  const optionValueIds: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (
      key.startsWith("optionValue:") &&
      typeof value === "string" &&
      value.trim().length > 0 &&
      value.trim() !== "__none__"
    ) {
      optionValueIds.push(value.trim());
    }
  }

  try {
    await updateProductVariant({
      productId: productIdValue.trim(),
      variantId: variantIdValue.trim(),
      sku: validated.data.sku,
      slug: validated.data.slug,
      name: validated.data.name,
      primaryImageId: validated.data.primaryImageMediaAssetId,
      status: validated.data.status,
      isDefault: validated.data.isDefault,
      sortOrder: validated.data.sortOrder,
      barcode: validated.data.barcode,
      externalReference: validated.data.externalReference,
      weightGrams: validated.data.weightGrams,
      widthMm: validated.data.widthMm,
      heightMm: validated.data.heightMm,
      depthMm: validated.data.depthMm,
      optionValueIds,
    });

    refresh();

    return {
      ...productVariantFormInitialState,
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "variant_sku_taken") {
        return {
          ...productVariantFormInitialState,
          status: "error",
          message: "SKU déjà utilisé.",
          fieldErrors: { sku: "Ce SKU est déjà utilisé par une autre variante de ce produit." },
        };
      }

      if (error.code === "variant_slug_taken") {
        return {
          ...productVariantFormInitialState,
          status: "error",
          message: "Slug déjà utilisé.",
          fieldErrors: { slug: "Ce slug est déjà utilisé par une autre variante de ce produit." },
        };
      }

      if (error.code === "option_values_invalid") {
        return {
          ...productVariantFormInitialState,
          status: "error",
          message: "Attributs invalides.",
          fieldErrors: {
            optionValues:
              "Les valeurs d'option sélectionnées sont invalides ou incohérentes avec ce produit.",
          },
        };
      }

      if (error.code === "duplicate_variant_option_combination") {
        return {
          ...productVariantFormInitialState,
          status: "error",
          message: "Combinaison déjà utilisée.",
          fieldErrors: {
            optionValues:
              "Une autre variante utilise déjà exactement cette combinaison d'attributs.",
          },
        };
      }

      if (error.code === "default_variant_required") {
        return {
          ...productVariantFormInitialState,
          status: "error",
          message: "Variante par défaut requise.",
          fieldErrors: {
            isDefault:
              "Choisissez une autre variante par défaut avant de retirer ce statut à celle-ci.",
          },
        };
      }

      return {
        ...productVariantFormInitialState,
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      ...productVariantFormInitialState,
      status: "error",
      message: "Erreur inattendue.",
    };
  }
};
