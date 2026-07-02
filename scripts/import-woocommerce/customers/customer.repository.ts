import { CustomerAddressType } from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";
import type { ImportedCustomerAddressInput, ImportedCustomerInput } from "./customer.types";

const SOURCE_SYSTEM = "woocommerce";

export async function findCustomerBySource(prisma: DbClient, storeId: string, sourceId: string) {
  return prisma.customer.findFirst({
    where: {
      storeId,
      sourceSystem: SOURCE_SYSTEM,
      sourceId,
    },
    select: {
      id: true,
      email: true,
      sourceSystem: true,
    },
  });
}

export async function findCustomerByEmail(prisma: DbClient, storeId: string, email: string) {
  return prisma.customer.findFirst({
    where: {
      storeId,
      email,
    },
    select: {
      id: true,
      email: true,
      sourceSystem: true,
    },
  });
}

export async function createCustomer(
  prisma: DbClient,
  storeId: string,
  input: ImportedCustomerInput
) {
  // `firstSeenAt` reflète la date d'inscription WooCommerce réelle
  // (`date_created`) quand elle est connue, pas la date d'exécution de
  // l'import — sinon tous les clients importés paraîtraient inscrits
  // aujourd'hui, ce qui fausserait toute lecture de récence en aval.
  const firstSeenAt = input.registeredAt ?? new Date();

  return prisma.customer.create({
    data: {
      storeId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      status: input.status,
      isGuest: input.isGuest,
      sourceSystem: SOURCE_SYSTEM,
      sourceId: input.sourceId,
      firstSeenAt,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

export async function updateCustomer(
  prisma: DbClient,
  customerId: string,
  input: ImportedCustomerInput
) {
  // `lastSeenAt` n'a pas d'équivalent WooCommerce fiable lors d'un resync
  // backend : on ne le touche pas ici pour éviter de faire paraître un client
  // inactif depuis des années comme récemment actif à chaque réexécution.
  return prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    },
    select: {
      id: true,
      email: true,
    },
  });
}

async function upsertCustomerAddressOfType(
  prisma: DbClient,
  customerId: string,
  type: CustomerAddressType,
  address: ImportedCustomerAddressInput | null
): Promise<void> {
  if (!address) {
    return;
  }

  const existing = await prisma.customerAddress.findFirst({
    where: {
      customerId,
      type,
    },
    select: {
      id: true,
    },
  });

  const data = {
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company,
    line1: address.line1,
    line2: address.line2,
    postalCode: address.postalCode,
    city: address.city,
    region: address.region,
    countryCode: address.countryCode,
    phone: address.phone,
  };

  if (existing) {
    await prisma.customerAddress.update({
      where: {
        id: existing.id,
      },
      data,
    });
    return;
  }

  await prisma.customerAddress.create({
    data: {
      customerId,
      type,
      isDefault: true,
      ...data,
    },
  });
}

// `CustomerAddress` n'a pas de contrainte unique `(customerId, type)` : sans
// politique explicite, un resync créerait un doublon d'adresse à chaque
// exécution. On applique donc un find-then-update-or-create, cohérent avec le
// pattern déjà utilisé pour Category/Product (`upsertImportedCategory`,
// `upsertImportedProduct`).
export async function upsertCustomerAddresses(
  prisma: DbClient,
  customerId: string,
  billing: ImportedCustomerAddressInput | null,
  shipping: ImportedCustomerAddressInput | null
): Promise<void> {
  await upsertCustomerAddressOfType(prisma, customerId, CustomerAddressType.BILLING, billing);
  await upsertCustomerAddressOfType(prisma, customerId, CustomerAddressType.SHIPPING, shipping);
}
