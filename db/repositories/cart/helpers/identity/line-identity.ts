type BuildCartLineItemKeyInput = {
  productId: string;
  productVariantId: string | null;
};

export function buildCartLineItemKey(input: BuildCartLineItemKeyInput): string {
  const variantPart = input.productVariantId ?? "none";
  return `${input.productId}::${variantPart}`;
}
