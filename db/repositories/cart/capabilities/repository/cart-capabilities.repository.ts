import type { StoreCommerceProfile } from "../types/cart-capabilities.types";

export async function getStoreCommerceProfile(_storeCode: string): Promise<StoreCommerceProfile> {
  return {
    storeCode: "default",
    currencyCode: "EUR",
    supportedCountryCodes: ["FR"],
    capabilities: {
      guestCheckout: true,
      customerCheckout: true,
      shipping: true,
      pickupPointDelivery: true,
      taxation: true,
      exciseTax: false,
      discounts: true,
      couponCodes: true,
      customerSpecificPricing: true,
      customerGroupPricing: true,
      volumePricing: true,
      professionalCustomers: true,
      backorders: false,
      preorders: false,
      giftOptions: false,
    },
  };
}
