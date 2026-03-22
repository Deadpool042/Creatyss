export type CommerceCapabilities = {
  guestCheckout: boolean;
  customerCheckout: boolean;
  shipping: boolean;
  pickupPointDelivery: boolean;
  taxation: boolean;
  exciseTax: boolean;
  discounts: boolean;
  couponCodes: boolean;
  customerSpecificPricing: boolean;
  customerGroupPricing: boolean;
  volumePricing: boolean;
  professionalCustomers: boolean;
  backorders: boolean;
  preorders: boolean;
  giftOptions: boolean;
};

export type StoreCommerceProfile = {
  storeCode: string;
  currencyCode: string;
  supportedCountryCodes: string[];
  capabilities: CommerceCapabilities;
};
