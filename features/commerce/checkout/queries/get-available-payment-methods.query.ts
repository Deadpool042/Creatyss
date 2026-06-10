import { db } from "@/core/db";

export type AvailablePaymentMethod = {
  readonly id: "bank_transfer" | "cash_on_delivery";
  readonly label: string;
  readonly instructions: string | null;
};

export async function getAvailablePaymentMethods(input: {
  storeId: string;
}): Promise<ReadonlyArray<AvailablePaymentMethod>> {
  const { storeId } = input;

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: {
      bankTransferEnabled: true,
      cashOnDeliveryEnabled: true,
      bankTransferInstructions: true,
      cashOnDeliveryInstructions: true,
    },
  });

  if (!store) return [];

  const methods: AvailablePaymentMethod[] = [];

  if (store.bankTransferEnabled) {
    methods.push({
      id: "bank_transfer",
      label: "Virement bancaire",
      instructions: store.bankTransferInstructions ?? null,
    });
  }

  if (store.cashOnDeliveryEnabled) {
    methods.push({
      id: "cash_on_delivery",
      label: "Paiement à l'atelier",
      instructions: store.cashOnDeliveryInstructions ?? null,
    });
  }

  return methods;
}
