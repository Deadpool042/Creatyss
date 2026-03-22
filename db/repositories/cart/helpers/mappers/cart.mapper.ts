import type { Cart, CartLine, CartLineSnapshot, CartTotals } from "@db-cart/core/types/cart.types";
import type { CartItemRow, CartRow } from "@db-cart/types/rows/cart.rows";

function resolveUnitPriceCents(row: CartItemRow): number | null {
  if (row.variant !== null) {
    return row.variant.priceCents;
  }

  return row.product.simplePriceCents;
}

function resolveVariantName(row: CartItemRow): string | null {
  return row.variant?.name ?? null;
}

function resolveImageStorageKey(row: CartItemRow): string | null {
  const variantImage = row.variant?.images[0]?.mediaAsset.storageKey ?? null;

  if (variantImage !== null) {
    return variantImage;
  }

  return row.product.images[0]?.mediaAsset.storageKey ?? null;
}

function resolveProductKind(row: CartItemRow): "physical" | "digital" | "hybrid" {
  return row.product.productKind;
}

function resolveLineValidity(row: CartItemRow): "valid" | "blocking" {
  if (row.product.status !== "published") {
    return "blocking";
  }

  if (row.variant !== null && row.variant.status !== "published") {
    return "blocking";
  }

  return "valid";
}

function resolveLineIssues(row: CartItemRow) {
  if (row.product.status !== "published") {
    return [
      {
        code: "product_unavailable" as const,
        message: "Le produit n'est plus disponible à la vente.",
      },
    ];
  }

  if (row.variant !== null && row.variant.status !== "published") {
    return [
      {
        code: "variant_unavailable" as const,
        message: "La variante n'est plus disponible à la vente.",
      },
    ];
  }

  return [];
}

function mapCartLineSnapshot(row: CartItemRow): CartLineSnapshot {
  return {
    productName: row.product.name,
    productSlug: row.product.slug,
    variantName: resolveVariantName(row),
    imageStorageKey: resolveImageStorageKey(row),
    unitPriceCents: resolveUnitPriceCents(row),
    productKind: resolveProductKind(row),
  };
}

function mapCartLine(row: CartItemRow): CartLine {
  return {
    id: row.id,
    itemKey: `${row.productId}::${row.variantId ?? "none"}`,
    productId: row.productId,
    productVariantId: row.variantId,
    quantity: row.quantity,
    snapshot: mapCartLineSnapshot(row),
    validity: resolveLineValidity(row),
    issues: resolveLineIssues(row),
  };
}

function computeSubtotalCents(lines: readonly CartLine[]): number {
  return lines.reduce((total, line) => {
    const unitPriceCents = line.snapshot.unitPriceCents ?? 0;
    return total + unitPriceCents * line.quantity;
  }, 0);
}

function buildCartTotals(lines: readonly CartLine[]): CartTotals {
  const subtotalCents = computeSubtotalCents(lines);

  return {
    currencyCode: "EUR",
    subtotalCents,
    discountCents: 0,
    discountedSubtotalCents: subtotalCents,
    estimatedShippingCents: null,
    estimatedTaxCents: null,
    estimatedExciseCents: null,
    estimatedTotalCents: subtotalCents,
  };
}

export function mapCartRowToCart(row: CartRow): Cart {
  const lines = row.items.map(mapCartLine);
  const totals = buildCartTotals(lines);

  const containsPhysicalItems = lines.some((line) => line.snapshot.productKind !== "digital");
  const containsDigitalItems = lines.some((line) => line.snapshot.productKind !== "physical");

  return {
    id: row.id,
    ownerKind: row.userId === null ? "guest" : "customer",
    customerId: row.userId,
    guestToken: row.guestToken,
    customerKind: null,
    shippingRequired: containsPhysicalItems,
    containsPhysicalItems,
    containsDigitalItems,
    lines,
    appliedDiscounts: [],
    totals,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapCart(cart: Cart): Cart {
  return {
    ...cart,
    lines: cart.lines.map((line) => ({
      ...line,
      issues: [...line.issues],
    })),
    appliedDiscounts: [...cart.appliedDiscounts],
  };
}
