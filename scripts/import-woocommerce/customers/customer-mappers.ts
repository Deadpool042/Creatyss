import { CustomerStatus } from "../../../src/generated/prisma/client";
import type { WooAddress, WooCustomer } from "../schemas";
import { toNullableText } from "../normalizers/text";
import type { ImportedCustomerAddressInput, ImportedCustomerInput } from "./customer.types";

// `entities/checkout/guest-checkout-input.ts` ne fournit que du trim + une
// validation de format (pas de mise en minuscule) : ce n'est pas une fonction
// de normalisation email réutilisable telle quelle pour cet import. La règle
// (trim + lowercase) est donc répliquée localement, volontairement minimale.
function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function mapWooAddress(
  address: WooAddress,
  phone: string | null
): ImportedCustomerAddressInput | null {
  const line1 = address.address_1.trim();

  if (line1.length === 0) {
    return null;
  }

  return {
    firstName: toNullableText(address.first_name),
    lastName: toNullableText(address.last_name),
    company: toNullableText(address.company),
    line1,
    line2: toNullableText(address.address_2),
    postalCode: address.postcode.trim(),
    city: address.city.trim(),
    region: toNullableText(address.state),
    countryCode: address.country.trim() || "FR",
    phone,
  };
}

// `acceptsEmail`/`acceptsSms` ne sont jamais définis ici : le consentement
// marketing ne peut pas être déduit d'un import WooCommerce. Le défaut Prisma
// (`false`) s'applique donc à la création. `status` reste `LEAD` par défaut :
// ces clients WooCommerce n'ont pas (encore) de commande confirmée côté
// Creatyss tant que l'import des commandes n'a pas tourné, ce qui est
// cohérent avec le défaut Prisma de `Customer.status`.
export function mapWooCustomerToImportedCustomer(customer: WooCustomer): ImportedCustomerInput {
  const email = normalizeEmail(customer.email);
  const billingPhone = toNullableText(customer.billing.phone);

  return {
    externalId: `woo_customer:${customer.id}`,
    sourceId: String(customer.id),
    email,
    firstName: toNullableText(customer.first_name) ?? toNullableText(customer.billing.first_name),
    lastName: toNullableText(customer.last_name) ?? toNullableText(customer.billing.last_name),
    phone: billingPhone,
    status: CustomerStatus.LEAD,
    isGuest: false,
    registeredAt: customer.date_created ? new Date(customer.date_created) : null,
    billingAddress: mapWooAddress(customer.billing, billingPhone),
    shippingAddress: mapWooAddress(customer.shipping, null),
  };
}
