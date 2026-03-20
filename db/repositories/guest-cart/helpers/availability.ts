export function isGuestCartVariantAvailable(variant: {
  status: string;
  stock_quantity: number;
  products: { status: string };
}): boolean {
  return (
    variant.products.status === "published" &&
    variant.status === "published" &&
    variant.stock_quantity > 0
  );
}

export function isGuestCartLineAvailable(variant: {
  status: string;
  stock_quantity: number;
  products: { status: string };
  quantity: number;
}): boolean {
  return (
    variant.products.status === "published" &&
    variant.status === "published" &&
    variant.stock_quantity >= variant.quantity &&
    variant.stock_quantity > 0
  );
}
