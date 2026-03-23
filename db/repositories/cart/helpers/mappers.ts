import type { Cart, CartLine, CartOwnerKind, CartStatus } from "@db-cart/core";
import type { CustomerCart } from "@db-cart/customer";
import type { GuestCart } from "@db-cart/guest";
import type { CartLineRow, CartRow } from "@db-cart/types/rows";

function mapCartStatus(status: "ACTIVE" | "CONVERTED" | "ABANDONED" | "EXPIRED"): CartStatus {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "CONVERTED":
      return "converted";
    case "ABANDONED":
      return "abandoned";
    case "EXPIRED":
      return "expired";
  }
}

function mapCartLine(row: CartLineRow): CartLine {
  return {
    id: row.id,
    variantId: row.variantId,
    quantity: row.quantity,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapCartOwnerKind(customerId: string | null): CartOwnerKind {
  return customerId ? "customer" : "guest";
}

export function mapCart(row: CartRow): Cart {
  return {
    id: row.id,
    storeId: row.storeId,
    customerId: row.customerId,
    ownerKind: mapCartOwnerKind(row.customerId),
    currencyCode: row.currencyCode,
    status: mapCartStatus(row.status),
    email: row.email,
    expiresAt: row.expiresAt,
    convertedAt: row.convertedAt,
    abandonedAt: row.abandonedAt,
    lines: row.lines.map(mapCartLine),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapGuestCart(row: CartRow): GuestCart {
  return mapCart(row) as GuestCart;
}

export function mapCustomerCart(row: CartRow): CustomerCart {
  return mapCart(row) as CustomerCart;
}
