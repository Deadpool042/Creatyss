import type { ShippingMethodOption } from "./shipping-method.types";

export type CartShippingSelection = {
  methodCode: string;
  pickupPointId: string | null;
};

export type CartShippingQuote = {
  methodCode: string;
  amountCents: number;
  currencyCode: string;
};

export type CartShippingContext = {
  countryCode: string | null;
  postalCode: string | null;
};

export type CartShippingState = {
  shippingRequired: boolean;
  availableMethods: ShippingMethodOption[];
  selectedMethod: CartShippingSelection | null;
  quote: CartShippingQuote | null;
};
