export type CheckoutPaymentMethod = "bank_transfer" | "cash_on_delivery";

export function isCheckoutPaymentMethod(value: unknown): value is CheckoutPaymentMethod {
  return value === "bank_transfer" || value === "cash_on_delivery";
}

export function mapCheckoutPaymentMethodToPrisma(
  method: CheckoutPaymentMethod
): "BANK_TRANSFER" | "CASH_ON_DELIVERY" {
  switch (method) {
    case "bank_transfer":
      return "BANK_TRANSFER";
    case "cash_on_delivery":
      return "CASH_ON_DELIVERY";
  }
}
