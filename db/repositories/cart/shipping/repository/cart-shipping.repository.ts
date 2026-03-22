import type {
  CartShippingContext,
  CartShippingSelection,
  CartShippingState,
} from "@db-cart/shipping/types/cart-shipping.types";
import { listAvailableShippingMethods } from "@db-cart/shipping/repository/shipping-method.repository";

function buildNeutralShippingState(): CartShippingState {
  return {
    shippingRequired: false,
    availableMethods: [],
    selectedMethod: null,
    quote: {
      methodCode: "none",
      amountCents: 0,
      currencyCode: "EUR",
    },
  };
}

function resolveSelectedMethod(
  availableMethodCodes: readonly string[],
  selection: CartShippingSelection | null
): CartShippingSelection | null {
  if (selection === null) {
    return null;
  }

  if (!availableMethodCodes.includes(selection.methodCode)) {
    return null;
  }

  return selection;
}

export async function resolveCartShippingState(input: {
  shippingRequired: boolean;
  context: CartShippingContext;
  selection: CartShippingSelection | null;
}): Promise<CartShippingState> {
  if (!input.shippingRequired) {
    return buildNeutralShippingState();
  }

  const availableMethods = await listAvailableShippingMethods(input.context.countryCode);

  const selectedMethod = resolveSelectedMethod(
    availableMethods.map((method) => method.code),
    input.selection
  );

  return {
    shippingRequired: true,
    availableMethods,
    selectedMethod,
    quote: null,
  };
}
