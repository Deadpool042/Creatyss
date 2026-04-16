import {
  MediaReferenceRole,
  MediaReferenceSubjectType,
  RelatedProductType,
} from "@/prisma-generated/client";

export function mapEditorRelatedTypeToPrismaType(
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar"
): RelatedProductType {
  switch (type) {
    case "related":
      return RelatedProductType.RELATED;
    case "cross_sell":
      return RelatedProductType.CROSS_SELL;
    case "up_sell":
      return RelatedProductType.UP_SELL;
    case "accessory":
      return RelatedProductType.ACCESSORY;
    case "similar":
      return RelatedProductType.SIMILAR;
  }
}

export function mapEditorSubjectTypeToPrismaSubjectType(
  subjectType: "product" | "product_variant"
): MediaReferenceSubjectType {
  switch (subjectType) {
    case "product":
      return MediaReferenceSubjectType.PRODUCT;
    case "product_variant":
      return MediaReferenceSubjectType.PRODUCT_VARIANT;
  }
}

export function mapEditorRoleToPrismaRole(
  role: "gallery" | "thumbnail" | "other"
): MediaReferenceRole {
  switch (role) {
    case "gallery":
      return MediaReferenceRole.GALLERY;
    case "thumbnail":
      return MediaReferenceRole.THUMBNAIL;
    case "other":
      return MediaReferenceRole.OTHER;
  }
}
