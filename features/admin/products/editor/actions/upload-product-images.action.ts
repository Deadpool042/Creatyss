"use server";

import { uploadProductImagesFormInitialState, type UploadProductImagesFormState } from "../types";
import { uploadProductImagesSchema } from "../schemas/upload-product-images.schema";
import { AdminProductEditorServiceError, uploadProductImages } from "../services";
import { isSupportedImageMimeType } from "@/core/uploads";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

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

    if (entry.size > MAX_FILE_SIZE_BYTES) {
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
