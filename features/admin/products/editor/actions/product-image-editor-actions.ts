"use server";

import { db } from "@/core/db";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import {
  attachProductImages,
  AdminProductEditorServiceError,
  deleteProductImage,
  generateMissingProductImageAltTexts,
  reorderProductImage,
  setProductPrimaryImage,
  updateProductImageAltText,
  uploadProductImages,
} from "../services";
import {
  uploadProductImagesFormInitialState,
  type AttachProductImagesInput,
  type AttachProductImagesResult,
  type DeleteProductImageInput,
  type DeleteProductImageResult,
  type GenerateMissingProductImageAltTextInput,
  type GenerateMissingProductImageAltTextResult,
  type ReorderProductImageInput,
  type ReorderProductImageResult,
  type SetProductPrimaryImageInput,
  type SetProductPrimaryImageResult,
  type UpdateProductImageAltTextInput,
  type UpdateProductImageAltTextResult,
  type UploadProductImagesFormState,
} from "../types";
import { uploadProductImagesSchema } from "../schemas";
import { isSupportedImageMimeType, MAX_IMAGE_FILE_SIZE_BYTES } from "@/core/uploads";

async function isMediaAutomationEnabled(productId: string): Promise<boolean> {
  const product = await db.product.findFirst({
    where: {
      id: productId,
      archivedAt: null,
    },
    select: {
      storeId: true,
    },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  return meetsFeatureLevel("catalog.products.media", "automation", {
    storeId: product.storeId,
  });
}

// ---------------------------------------------------------------------------
// attachProductImagesAction
// ---------------------------------------------------------------------------

export async function attachProductImagesAction(
  input: AttachProductImagesInput
): Promise<AttachProductImagesResult> {
  try {
    const productIds = [...new Set(input.images.map((image) => image.productId))];
    const automationEnabled =
      productIds.length === 1 ? await isMediaAutomationEnabled(productIds[0]!) : false;

    const result = await attachProductImages({
      images: input.images,
      autoGenerateMissingAltText: automationEnabled,
    });

    return {
      status: "success",
      message:
        automationEnabled && result.generatedCount > 0
          ? `Association effectuée. ${result.generatedCount} texte${result.generatedCount > 1 ? "s" : ""} alternatif${result.generatedCount > 1 ? "s ont" : " a"} ete complete${result.generatedCount > 1 ? "s" : ""} automatiquement.`
          : "Association effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Association impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}

// ---------------------------------------------------------------------------
// deleteProductImageAction
// ---------------------------------------------------------------------------

export async function deleteProductImageAction(
  input: DeleteProductImageInput
): Promise<DeleteProductImageResult> {
  try {
    await deleteProductImage({
      productId: input.productId,
      imageId: input.imageId,
    });

    return {
      status: "success",
      message: "Suppression effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Suppression impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}

// ---------------------------------------------------------------------------
// generateMissingProductImageAltTextsAction
// ---------------------------------------------------------------------------

export async function generateMissingProductImageAltTextsAction(
  input: GenerateMissingProductImageAltTextInput
): Promise<GenerateMissingProductImageAltTextResult> {
  try {
    const result = await generateMissingProductImageAltTexts({
      productId: input.productId,
    });

    return {
      status: "success",
      message:
        result.count > 0
          ? `${result.count} texte${result.count > 1 ? "s" : ""} alternatif${result.count > 1 ? "s ont" : " a"} ete genere${result.count > 1 ? "s" : ""}.`
          : "Aucun texte alternatif manquant a generer.",
      generatedCount: result.count,
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Generation impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}

// ---------------------------------------------------------------------------
// reorderProductImageAction
// ---------------------------------------------------------------------------

export async function reorderProductImageAction(
  input: ReorderProductImageInput
): Promise<ReorderProductImageResult> {
  try {
    await reorderProductImage({
      productId: input.productId,
      imageId: input.imageId,
      sortOrder: input.sortOrder,
    });

    return {
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}

// ---------------------------------------------------------------------------
// setProductPrimaryImageAction
// ---------------------------------------------------------------------------

export async function setProductPrimaryImageAction(
  input: SetProductPrimaryImageInput
): Promise<SetProductPrimaryImageResult> {
  try {
    await setProductPrimaryImage({
      productId: input.productId,
      mediaAssetId: input.mediaAssetId,
    });

    return {
      status: "success",
      message: "Mise à jour effectuée.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}

// ---------------------------------------------------------------------------
// updateProductImageAltTextAction
// ---------------------------------------------------------------------------

export async function updateProductImageAltTextAction(
  input: UpdateProductImageAltTextInput
): Promise<UpdateProductImageAltTextResult> {
  try {
    await updateProductImageAltText({
      productId: input.productId,
      imageId: input.imageId,
      altText: input.altText,
    });

    return {
      status: "success",
      message: "Texte alternatif mis à jour.",
    };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      return {
        status: "error",
        message: "Mise à jour impossible.",
      };
    }

    return {
      status: "error",
      message: "Erreur inattendue.",
    };
  }
}

// ---------------------------------------------------------------------------
// uploadProductImagesAction
// ---------------------------------------------------------------------------

function isFile(value: FormDataEntryValue): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export async function uploadProductImagesAction(
  _prevState: UploadProductImagesFormState,
  formData: FormData
): Promise<UploadProductImagesFormState> {
  // 1. Parse and validate non-file fields.
  const parsed = uploadProductImagesSchema.safeParse({
    productId: formData.get("productId"),
    altText: formData.get("altText") ?? "",
    makePrimary: formData.get("makePrimary") === "true",
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const fieldErrors: UploadProductImagesFormState["fieldErrors"] = {};
    if (flat.productId?.[0] !== undefined) fieldErrors.productId = flat.productId[0];
    if (flat.altText?.[0] !== undefined) fieldErrors.altText = flat.altText[0];
    if (flat.makePrimary?.[0] !== undefined) fieldErrors.makePrimary = flat.makePrimary[0];
    return { status: "error", message: null, fieldErrors };
  }

  // 2. Extract and validate files.
  const rawFiles = formData.getAll("files");
  const validFiles: File[] = [];

  for (const entry of rawFiles) {
    if (!isFile(entry)) continue;
    if (entry.size <= 0) continue;

    if (entry.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      return {
        status: "error",
        message: null,
        fieldErrors: { files: `Le fichier « ${entry.name} » dépasse la limite de 10 Mo.` },
      };
    }

    if (!isSupportedImageMimeType(entry.type)) {
      return {
        status: "error",
        message: null,
        fieldErrors: {
          files: `Le fichier « ${entry.name} » n'est pas un format supporté (JPEG, PNG, WebP, AVIF).`,
        },
      };
    }

    validFiles.push(entry);
  }

  if (validFiles.length === 0) {
    return {
      status: "error",
      message: null,
      fieldErrors: { files: "Aucun fichier valide sélectionné." },
    };
  }

  // 3. Delegate to service.
  try {
    const automationEnabled = await isMediaAutomationEnabled(parsed.data.productId);
    const result = await uploadProductImages({
      productId: parsed.data.productId,
      altText: parsed.data.altText,
      makePrimary: parsed.data.makePrimary,
      files: validFiles,
      autoGenerateMissingAltText: automationEnabled,
    });

    const count = result.count;
    const baseMessage =
      count === 1 ? "1 image importée avec succès." : `${count} images importées avec succès.`;
    const message =
      automationEnabled && result.generatedCount > 0
        ? `${baseMessage} ${result.generatedCount} texte${result.generatedCount > 1 ? "s" : ""} alternatif${result.generatedCount > 1 ? "s ont" : " a"} ete complete${result.generatedCount > 1 ? "s" : ""} automatiquement.`
        : baseMessage;

    return { ...uploadProductImagesFormInitialState, status: "success", message };
  } catch (error: unknown) {
    if (error instanceof AdminProductEditorServiceError) {
      if (error.code === "product_missing") {
        return {
          status: "error",
          message: "Produit introuvable.",
          fieldErrors: {},
        };
      }

      return {
        status: "error",
        message: "Import impossible.",
        fieldErrors: {},
      };
    }

    return {
      status: "error",
      message: "Une erreur inattendue est survenue lors de l'import.",
      fieldErrors: {},
    };
  }
}
