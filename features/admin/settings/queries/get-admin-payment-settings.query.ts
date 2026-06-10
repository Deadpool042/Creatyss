import { db } from "@/core/db";

export type AdminPaymentSettings = {
  bankTransferEnabled: boolean;
  cashOnDeliveryEnabled: boolean;
  bankTransferInstructions: string | null;
  cashOnDeliveryInstructions: string | null;
};

const defaultAdminPaymentSettings: AdminPaymentSettings = {
  bankTransferEnabled: false,
  cashOnDeliveryEnabled: false,
  bankTransferInstructions: null,
  cashOnDeliveryInstructions: null,
};

export async function getAdminPaymentSettings(): Promise<AdminPaymentSettings> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      bankTransferEnabled: true,
      cashOnDeliveryEnabled: true,
      bankTransferInstructions: true,
      cashOnDeliveryInstructions: true,
    },
  });

  if (!store) return defaultAdminPaymentSettings;

  return {
    bankTransferEnabled: store.bankTransferEnabled,
    cashOnDeliveryEnabled: store.cashOnDeliveryEnabled,
    bankTransferInstructions: store.bankTransferInstructions ?? null,
    cashOnDeliveryInstructions: store.cashOnDeliveryInstructions ?? null,
  };
}
