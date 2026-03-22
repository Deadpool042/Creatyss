import type { Prisma } from "@prisma/client";

export const cartItemSelect = {
  id: true,
  productId: true,
  variantId: true,
  quantity: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      slug: true,
      name: true,
      productKind: true,
      simplePriceCents: true,
      status: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
        select: {
          mediaAsset: {
            select: {
              storageKey: true,
            },
          },
        },
      },
    },
  },
  variant: {
    select: {
      id: true,
      name: true,
      priceCents: true,
      status: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
        select: {
          mediaAsset: {
            select: {
              storageKey: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.CartItemSelect;

export const cartSelect = {
  id: true,
  userId: true,
  guestToken: true,
  createdAt: true,
  updatedAt: true,
  items: {
    orderBy: [{ createdAt: "asc" }],
    select: cartItemSelect,
  },
} satisfies Prisma.CartSelect;

export type CartItemRow = Prisma.CartItemGetPayload<{
  select: typeof cartItemSelect;
}>;

export type CartRow = Prisma.CartGetPayload<{
  select: typeof cartSelect;
}>;
