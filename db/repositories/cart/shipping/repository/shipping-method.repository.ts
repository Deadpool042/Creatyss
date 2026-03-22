import type { ShippingMethodOption } from "@db-cart/shipping/types/shipping-method.types";

const SHIPPING_METHODS: readonly ShippingMethodOption[] = [
  {
    code: "colissimo_home",
    kind: "home_delivery",
    label: "Colissimo domicile",
    requiresAddress: true,
    requiresPickupPoint: false,
    supportedCountryCodes: ["FR"],
  },
  {
    code: "mondial_relay_pickup",
    kind: "pickup_point",
    label: "Mondial Relay",
    requiresAddress: true,
    requiresPickupPoint: true,
    supportedCountryCodes: ["FR", "BE"],
  },
];

export async function listAvailableShippingMethods(
  countryCode: string | null
): Promise<ShippingMethodOption[]> {
  if (countryCode === null) {
    return [...SHIPPING_METHODS];
  }

  const normalizedCountryCode = countryCode.trim().toUpperCase();

  return SHIPPING_METHODS.filter((method) =>
    method.supportedCountryCodes.includes(normalizedCountryCode)
  );
}
