"use server";

import { revalidatePath } from "next/cache";
import {
  MediaAssetKind,
  MediaAssetStatus,
  MediaReferenceRole,
  MediaReferenceSubjectType,
} from "@/prisma-generated/client";

import { db, withTransaction } from "@/core/db";
import {
  buildProductUploadRelativeDirectory,
  ensureUploadsDirectory,
  saveUploadedImage,
} from "@/core/uploads";
import { uploadProductImagesSchema } from "@/features/admin/products/editor/schemas/upload-product-images.schema";
import type { UploadProductImagesFormState } from "@/features/admin/products/editor/types/product-image-upload-multi.types";

function buildFieldErrors(input: {
  files?: string;
  altText?: string;
  productId?: string;
  makePrimary?: string;
}): UploadProductImagesFormState["fieldErrors"] {
  const fieldErrors: UploadProductImagesFormState["fieldErrors"] = {};

  if (input.files) fieldErrors.files = input.files;
  if (input.altText) fieldErrors.altText = input.altText;
  if (input.productId) fieldErrors.productId = input.productId;
  if (input.makePrimary) fieldErrors.makePrimary = input.makePrimary;

  return fieldErrors;
}

function readBooleanField(formData: FormData, key: string): boolean {
  const value = String(formData.get(key) ?? "");
  return value === "true" || value === "on" || value === "1";
}

function readFileFields(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File)
    .filter((file) => file.size > 0);
}

export async function uploadProductImagesAction(
  _previousState: UploadProductImagesFormState,
  formData: FormData
): Promise<UploadProductImagesFormState> {
  const files = readFileFields(formData, "files");

  const parsed = uploadProductImagesSchema.safeParse({
    productId: String(formData.get("productId") ?? "").trim(),
    altText: String(formData.get("altText") ?? "").trim(),
    makePrimary: readBooleanField(formData, "makePrimary"),
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const productIdError = issues.find((issue) => issue.path[0] === "productId")?.message;
    const altTextError = issues.find((issue) => issue.path[0] === "altText")?.message;
    const makePrimaryError = issues.find((issue) => issue.path[0] === "makePrimary")?.message;

    return {
      status: "error",
      message: "Le formulaire contient des erreurs.",
      fieldErrors: buildFieldErrors({
        ...(productIdError ? { productId: productIdError } : {}),
        ...(altTextError ? { altText: altTextError } : {}),
        ...(makePrimaryError ? { makePrimary: makePrimaryError } : {}),
      }),
    };
  }

  const { productId, altText, makePrimary } = parsed.data;

  if (files.length === 0) {
    return {
      status: "error",
      message: "Aucun fichier image n’a été fourni.",
      fieldErrors: buildFieldErrors({
        files: "Choisis au moins une image à importer.",
      }),
    };
  }

  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      slug: true,
      storeId: true,
      primaryImageId: true,
    },
  });

  if (!product) {
    return {
      status: "error",
      message: "Le produit demandé est introuvable.",
      fieldErrors: buildFieldErrors({
        productId: "Produit introuvable.",
      }),
    };
  }

  await ensureUploadsDirectory();

  const savedImages: Array<{
    originalFilename: string;
    publicUrl: string;
    mimeType: string;
    width: number;
    height: number;
    size: number;
  }> = [];

  for (const file of files) {
    try {
      const savedImage = await saveUploadedImage({
        file,
        relativeDirectory: buildProductUploadRelativeDirectory(product.slug),
        baseName: altText.length > 0 ? altText : product.slug,
      });

      savedImages.push({
        originalFilename: file.name,
        publicUrl: savedImage.publicUrl,
        mimeType: savedImage.mimeType,
        width: savedImage.width,
        height: savedImage.height,
        size: savedImage.size,
      });
    } catch {
      return {
        status: "error",
        message: "Impossible de traiter une ou plusieurs images.",
        fieldErrors: buildFieldErrors({
          files: "Au moins un fichier image n’a pas pu être traité.",
        }),
      };
    }
  }

  await withTransaction(async (tx) => {
    const existingReferences = await tx.mediaReference.findMany({
      where: {
        subjectType: MediaReferenceSubjectType.PRODUCT,
        subjectId: product.id,
        archivedAt: null,
      },
      orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
      select: {
        sortOrder: true,
      },
    });

    let nextSortOrder = (existingReferences[0]?.sortOrder ?? -1) + 1;
    let firstCreatedAssetId: string | null = null;

    const shouldForcePrimary = savedImages.length === 1 && makePrimary;
    const shouldAutoPrimary = !product.primaryImageId;

    if (shouldForcePrimary) {
      await tx.mediaReference.updateMany({
        where: {
          subjectType: MediaReferenceSubjectType.PRODUCT,
          subjectId: product.id,
          archivedAt: null,
        },
        data: {
          isPrimary: false,
          role: MediaReferenceRole.GALLERY,
        },
      });
    }

    for (const [index, savedImage] of savedImages.entries()) {
      const storageKey = savedImage.publicUrl.replace(/^\/+/, "");

      const mediaAsset = await tx.mediaAsset.create({
        data: {
          storeId: product.storeId ?? null,
          kind: MediaAssetKind.IMAGE,
          status: MediaAssetStatus.ACTIVE,
          originalFilename: savedImage.originalFilename,
          mimeType: savedImage.mimeType,
          extension: "webp",
          storageKey,
          publicUrl: savedImage.publicUrl,
          altText: altText.length > 0 ? altText : null,
          widthPx: savedImage.width > 0 ? savedImage.width : null,
          heightPx: savedImage.height > 0 ? savedImage.height : null,
          sizeBytes: savedImage.size,
          isPublic: true,
          publishedAt: new Date(),
        },
        select: {
          id: true,
        },
      });

      if (index === 0) {
        firstCreatedAssetId = mediaAsset.id;
      }

      const isPrimaryReference =
        (shouldForcePrimary && index === 0) || (shouldAutoPrimary && index === 0);

      await tx.mediaReference.create({
        data: {
          assetId: mediaAsset.id,
          subjectType: MediaReferenceSubjectType.PRODUCT,
          subjectId: product.id,
          role: isPrimaryReference ? MediaReferenceRole.PRIMARY : MediaReferenceRole.GALLERY,
          isPrimary: isPrimaryReference,
          sortOrder: nextSortOrder,
        },
      });

      nextSortOrder += 1;
    }

    if (firstCreatedAssetId && (shouldForcePrimary || shouldAutoPrimary)) {
      await tx.product.update({
        where: { id: product.id },
        data: {
          primaryImageId: firstCreatedAssetId,
        },
      });
    }
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${product.slug}/edit`);

  return {
    status: "success",
    message:
      savedImages.length > 1
        ? `${savedImages.length} images ont été importées avec succès.`
        : "L’image a été importée avec succès.",
    fieldErrors: {},
  };
}
