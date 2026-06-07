"use server";

import {
  attachProductImages,
  AdminProductEditorServiceError,
  deleteProductImage,
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

// ---------------------------------------------------------------------------
// attachProductImagesAction
// ---------------------------------------------------------------------------

export async function attachProductImagesAction(
  input: AttachProductImagesInput
): Promise<AttachProductImagesResult> {
  try {
    await attachProductImages({
      images: input.images,
    });

    return {
      status: "success",
      message: "Association effectuée.",
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
    const result = await uploadProductImages({
      productId: parsed.data.productId,
      altText: parsed.data.altText,
      makePrimary: parsed.data.makePrimary,
      files: validFiles,
    });

    const count = result.count;
    const message =
      count === 1 ? "1 image importée avec succès." : `${count} images importées avec succès.`;

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
