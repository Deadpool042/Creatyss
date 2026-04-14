import { db } from "@/core/db";
import type { AdminCreatableProductTypeCode } from "../types";

type AdminCreatableProductTypeRecord = {
  id: string;
  code: AdminCreatableProductTypeCode;
  name: string;
  slug: string;
  isActive: boolean;
};

const ADMIN_CREATABLE_PRODUCT_TYPE_DEFINITIONS: ReadonlyArray<{
  code: AdminCreatableProductTypeCode;
  name: string;
  slug: string;
  description: string;
}> = [
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
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (store === null) {
    throw new Error("store_missing");
  }

  await Promise.all(
    ADMIN_CREATABLE_PRODUCT_TYPE_DEFINITIONS.map((definition) =>
      db.productType.upsert({
        where: {
          storeId_code: {
            storeId: store.id,
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
          storeId: store.id,
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
      storeId: store.id,
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
      return (order.get(left.code) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(right.code) ?? Number.MAX_SAFE_INTEGER);
    });

  return {
    storeId: store.id,
    productTypes: ordered,
  };
}
