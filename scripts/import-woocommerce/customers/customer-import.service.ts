import type { WooCustomer } from "../schemas";
import type { DbClient } from "../shared/db";
import { endProgress, logProgress, logWarn } from "../shared/logging";
import { mapWooCustomerToImportedCustomer } from "./customer-mappers";
import {
  createCustomer,
  findCustomerByEmail,
  findCustomerBySource,
  updateCustomer,
  upsertCustomerAddresses,
} from "./customer.repository";
import type { ImportCustomersResult } from "./customer.types";

export async function importCustomers(
  prisma: DbClient,
  input: {
    storeId: string;
    customers: readonly WooCustomer[];
  }
): Promise<ImportCustomersResult> {
  const customerIdByExternalId = new Map<string, string>();

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const [index, wooCustomer] of input.customers.entries()) {
    logProgress(index + 1, input.customers.length, "Importing customers");

    const mappedCustomer = mapWooCustomerToImportedCustomer(wooCustomer);

    const existingBySource = await findCustomerBySource(
      prisma,
      input.storeId,
      mappedCustomer.sourceId
    );

    if (existingBySource) {
      const savedCustomer = await updateCustomer(prisma, existingBySource.id, mappedCustomer);
      await upsertCustomerAddresses(
        prisma,
        savedCustomer.id,
        mappedCustomer.billingAddress,
        mappedCustomer.shippingAddress
      );
      customerIdByExternalId.set(mappedCustomer.externalId, savedCustomer.id);
      updated += 1;
      continue;
    }

    const existingByEmail = await findCustomerByEmail(prisma, input.storeId, mappedCustomer.email);

    if (existingByEmail) {
      // Un client existe déjà avec cet email mais sans lien WooCommerce (compte
      // natif Creatyss, ou déjà rattaché à une autre source) : on ne l'écrase
      // jamais, on se contente de journaliser et de passer au suivant.
      logWarn(
        `Client existant trouvé pour l'email "${mappedCustomer.email}" ` +
          `(id ${existingByEmail.id}, sourceSystem=${existingByEmail.sourceSystem ?? "null"}) ` +
          "— import WooCommerce ignoré pour ne pas écraser ce compte."
      );
      skipped += 1;
      continue;
    }

    const savedCustomer = await createCustomer(prisma, input.storeId, mappedCustomer);
    await upsertCustomerAddresses(
      prisma,
      savedCustomer.id,
      mappedCustomer.billingAddress,
      mappedCustomer.shippingAddress
    );
    customerIdByExternalId.set(mappedCustomer.externalId, savedCustomer.id);
    imported += 1;
  }

  if (input.customers.length > 0) {
    endProgress(`Imported ${imported} customers (${updated} updated, ${skipped} skipped)`);
  }

  return {
    customerIdByExternalId,
    imported,
    updated,
    skipped,
  };
}
