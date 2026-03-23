import type { Prisma } from "@prisma/client";

const cartLineSelect = {
  id: true,
  variantId: true,
  quantity: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.CartLineSelect;

export const cartSelect = {
  id: true,
  storeId: true,
  customerId: true,
  currencyCode: true,
  status: true,
  email: true,
  expiresAt: true,
  convertedAt: true,
  abandonedAt: true,
  createdAt: true,
  updatedAt: true,
  lines: {
    orderBy: [{ createdAt: "asc" }],
    select: cartLineSelect,
  },
} as const satisfies Prisma.CartSelect;

export type CartRow = Prisma.CartGetPayload<{
  select: typeof cartSelect;
}>;

export type CartLineRow = Prisma.CartLineGetPayload<{
  select: typeof cartLineSelect;
}>;
