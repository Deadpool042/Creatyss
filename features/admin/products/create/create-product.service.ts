import { db } from "@/core/db";
import { mapProductLifecycleStatusToPrismaStatus } from "@/entities/product";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { syncProductSearchDocumentInTx } from "@/features/search/services/sync-product-search-document.service";

import type { AdminCreatableProductTypeCode } from "./create-product.types";

export class CreateProductServiceError extends Error {
  readonly code: "slug_taken";

  constructor(code: "slug_taken", message?: string) {
    super(message ?? code);
    this.name = "CreateProductServiceError";
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AdminCreatableProductTypeRecord = {
  id: string;
  code: AdminCreatableProductTypeCode;
  name: string;
  slug: string;
  isActive: boolean;
};

// ---------------------------------------------------------------------------
// ensure-admin-creatable-product-types (formerly separate service)
// ---------------------------------------------------------------------------

type AdminCreatableProductTypeDefinition = {
  code: AdminCreatableProductTypeCode;
  name: string;
  slug: string;
  description: string;
};

const ADMIN_CREATABLE_PRODUCT_TYPE_DEFINITIONS: ReadonlyArray<AdminCreatableProductTypeDefinition> =
  [
    {
      code: "simple",
      name: "Produit simple",
      slug: "simple",
      description: "Produit vendu seul, sans déclinaison obligatoire.",
    },
    {
      code: "variable",
      name: "Produit à variantes",
      slug: "variable",
      description: "Produit avec déclinaisons (taille, couleur, etc.).",
    },
  ];

export function isAdminCreatableProductTypeCode(
  value: string
): value is AdminCreatableProductTypeCode {
  return value === "simple" || value === "variable";
}

export async function ensureAdminCreatableProductTypes(): Promise<{
  storeId: string;
  productTypes: AdminCreatableProductTypeRecord[];
}> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    throw new Error("store_missing");
  }

  await Promise.all(
    ADMIN_CREATABLE_PRODUCT_TYPE_DEFINITIONS.map((definition) =>
      db.productType.upsert({
        where: {
          storeId_code: {
            storeId,
            code: definition.code,
          },
        },
        update: {
          name: definition.name,
          slug: definition.slug,
          description: definition.description,
          isActive: true,
          archivedAt: null,
        },
        create: {
          storeId,
          code: definition.code,
          name: definition.name,
          slug: definition.slug,
          description: definition.description,
          isActive: true,
        },
      })
    )
  );

  const productTypes = await db.productType.findMany({
    where: {
      storeId,
      archivedAt: null,
      code: {
        in: ADMIN_CREATABLE_PRODUCT_TYPE_DEFINITIONS.map((item) => item.code),
      },
    },
    select: {
      id: true,
      code: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });

  const order = new Map<AdminCreatableProductTypeCode, number>(
    ADMIN_CREATABLE_PRODUCT_TYPE_DEFINITIONS.map((item, index) => [item.code, index])
  );

  const ordered = productTypes
    .filter((item): item is AdminCreatableProductTypeRecord =>
      isAdminCreatableProductTypeCode(item.code)
    )
    .sort((left, right) => {
      return (
        (order.get(left.code) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(right.code) ?? Number.MAX_SAFE_INTEGER)
      );
    });

  return {
    storeId,
    productTypes: ordered,
  };
}

// ---------------------------------------------------------------------------
// create-product (formerly separate service)
// ---------------------------------------------------------------------------

type CreateProductServiceInput = {
  slug: string;
  name: string;
  storeId: string;
  productTypeId: string;
  isStandalone: boolean;
};

export async function createProduct(input: CreateProductServiceInput): Promise<{ id: string }> {
  const existingProduct = await db.product.findFirst({
    where: { slug: input.slug },
    select: { id: true },
  });

  if (existingProduct !== null) {
    throw new CreateProductServiceError("slug_taken");
  }

  return db.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        slug: input.slug,
        name: input.name,
        status: mapProductLifecycleStatusToPrismaStatus("draft"),
        isFeatured: false,
        isStandalone: input.isStandalone,
        productType: { connect: { id: input.productTypeId } },
        store: { connect: { id: input.storeId } },
      },
      select: { id: true },
    });

    if (input.isStandalone) {
      await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: input.slug,
          isDefault: true,
          sortOrder: 0,
        },
      });
    }

    try {
      await syncProductSearchDocumentInTx(tx, product.id);
    } catch (searchError) {
      console.error(
        "[products] syncProductSearchDocumentInTx failed — create unaffected",
        searchError
      );
    }

    return { id: product.id };
  });
}
