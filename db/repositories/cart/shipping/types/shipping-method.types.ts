export type ShippingMethodCode = "colissimo_home" | "mondial_relay_pickup";

export type ShippingMethodKind = "home_delivery" | "pickup_point";

export type ShippingMethodOption = {
  code: ShippingMethodCode;
  kind: ShippingMethodKind;
  label: string;
  requiresAddress: boolean;
  requiresPickupPoint: boolean;
  supportedCountryCodes: string[];
};
