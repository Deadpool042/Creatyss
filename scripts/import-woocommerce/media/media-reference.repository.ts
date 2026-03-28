import {
  MediaReferenceRole,
  MediaReferenceSubjectType,
} from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";

async function upsertMediaReference(
  prisma: DbClient,
  input: {
    assetId: string;
    subjectType: MediaReferenceSubjectType;
    subjectId: string;
    role: MediaReferenceRole;
    sortOrder: number;
    isPrimary: boolean;
  }
) {
  const existing = await prisma.mediaReference.findFirst({
    where: {
      assetId: input.assetId,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      role: input.role,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return prisma.mediaReference.update({
      where: {
        id: existing.id,
      },
      data: {
        sortOrder: input.sortOrder,
        isPrimary: input.isPrimary,
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  }

  return prisma.mediaReference.create({
    data: {
      assetId: input.assetId,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      role: input.role,
      sortOrder: input.sortOrder,
      isPrimary: input.isPrimary,
      isActive: true,
    },
    select: {
      id: true,
    },
  });
}

export async function attachProductPrimaryImageReference(
  prisma: DbClient,
  input: {
    assetId: string;
    productId: string;
  }
) {
  return upsertMediaReference(prisma, {
    assetId: input.assetId,
    subjectType: MediaReferenceSubjectType.PRODUCT,
    subjectId: input.productId,
    role: MediaReferenceRole.PRIMARY,
    sortOrder: 0,
    isPrimary: true,
  });
}

export async function attachProductGalleryImageReference(
  prisma: DbClient,
  input: {
    assetId: string;
    productId: string;
    sortOrder: number;
  }
) {
  return upsertMediaReference(prisma, {
    assetId: input.assetId,
    subjectType: MediaReferenceSubjectType.PRODUCT,
    subjectId: input.productId,
    role: MediaReferenceRole.GALLERY,
    sortOrder: input.sortOrder,
    isPrimary: false,
  });
}

export async function attachVariantPrimaryImageReference(
  prisma: DbClient,
  input: {
    assetId: string;
    variantId: string;
    sortOrder: number;
  }
) {
  return upsertMediaReference(prisma, {
    assetId: input.assetId,
    subjectType: MediaReferenceSubjectType.PRODUCT_VARIANT,
    subjectId: input.variantId,
    role: MediaReferenceRole.PRIMARY,
    sortOrder: input.sortOrder,
    isPrimary: true,
  });
}

export async function attachCategoryPrimaryImageReference(
  prisma: DbClient,
  input: {
    assetId: string;
    categoryId: string;
  }
) {
  return upsertMediaReference(prisma, {
    assetId: input.assetId,
    subjectType: MediaReferenceSubjectType.CATEGORY,
    subjectId: input.categoryId,
    role: MediaReferenceRole.PRIMARY,
    sortOrder: 0,
    isPrimary: true,
  });
}

export async function attachBlogPostPrimaryImageReference(
  prisma: DbClient,
  input: {
    assetId: string;
    blogPostId: string;
  }
) {
  return upsertMediaReference(prisma, {
    assetId: input.assetId,
    subjectType: MediaReferenceSubjectType.BLOG_POST,
    subjectId: input.blogPostId,
    role: MediaReferenceRole.PRIMARY,
    sortOrder: 0,
    isPrimary: true,
  });
}
