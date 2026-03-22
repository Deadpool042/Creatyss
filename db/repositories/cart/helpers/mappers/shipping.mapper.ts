import type { CartShippingState } from "@db-cart/shipping/types/cart-shipping.types";

export function mapCartShippingState(shippingState: CartShippingState): CartShippingState {
  return {
    ...shippingState,
    availableMethods: [...shippingState.availableMethods],
    selectedMethod:
      shippingState.selectedMethod === null ? null : { ...shippingState.selectedMethod },
    quote: shippingState.quote === null ? null : { ...shippingState.quote },
  };
}
