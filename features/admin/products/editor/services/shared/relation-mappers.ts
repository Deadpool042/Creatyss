import {
  MediaReferenceRole,
  MediaReferenceSubjectType,
  type RelatedProductType,
} from "@/prisma-generated/client";
import { mapProductRelatedTypeToPrismaRelatedType } from "@/entities/product";

export function mapEditorRelatedTypeToPrismaType(
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar"
): RelatedProductType {
  return mapProductRelatedTypeToPrismaRelatedType(type);
}

export function mapEditorSubjectTypeToPrismaSubjectType(
  subjectType: "product" | "product_variant"
): MediaReferenceSubjectType {
  return subjectType === "product_variant"
    ? MediaReferenceSubjectType.PRODUCT_VARIANT
    : MediaReferenceSubjectType.PRODUCT;
}

export function mapEditorRoleToPrismaRole(
  role: "gallery" | "thumbnail" | "other"
): MediaReferenceRole {
  if (role === "thumbnail") return MediaReferenceRole.THUMBNAIL;
  if (role === "other") return MediaReferenceRole.OTHER;
  return MediaReferenceRole.GALLERY;
}

export function mapPrismaSubjectTypeToEditorSubjectType(
  subjectType: MediaReferenceSubjectType
): "product" | "product_variant" {
  return subjectType === MediaReferenceSubjectType.PRODUCT_VARIANT ? "product_variant" : "product";
}

export function mapPrismaRoleToEditorRole(role: MediaReferenceRole): "gallery" | "thumbnail" | "other" {
  if (role === MediaReferenceRole.THUMBNAIL) return "thumbnail";
  if (role === MediaReferenceRole.OTHER) return "other";
  return "gallery";
}
