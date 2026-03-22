export type CartPricingSummary = {
  currencyCode: string;
  subtotalCents: number;
  discountCents: number;
  discountedSubtotalCents: number;
  estimatedShippingCents: number | null;
  estimatedTaxCents: number | null;
  estimatedExciseCents: number | null;
  estimatedTotalCents: number | null;
};
