import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminShippingMethodSummary = {
  id: string;
  code: string;
  name: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  currencyCode: string;
  amount: number;
  minSubtotalAmount: number | null;
  maxSubtotalAmount: number | null;
  isDefault: boolean;
};

export type AdminShippingZoneSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  methods: AdminShippingMethodSummary[];
};

export type AdminShippingZonesData = {
  storeCurrencyCode: string;
  zones: AdminShippingZoneSummary[];
};

export async function listAdminShippingZones(): Promise<AdminShippingZonesData | null> {
  const storeId = await getCurrentStoreId();
  if (storeId === null) return null;

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { defaultCurrency: true },
  });
  if (!store) return null;

  // La zone "FR" reste pilotée par ShippingSettingsForm (frais standard + seuil
  // de livraison offerte) — exclue ici pour éviter deux écrans concurrents sur
  // la même zone.
  const zones = await db.shippingZone.findMany({
    where: { storeId, code: { not: "FR" }, archivedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      status: true,
      methods: {
        where: { archivedAt: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          code: true,
          name: true,
          status: true,
          currencyCode: true,
          amount: true,
          minSubtotalAmount: true,
          maxSubtotalAmount: true,
          isDefault: true,
        },
      },
    },
  });

  return {
    storeCurrencyCode: store.defaultCurrency as string,
    zones: zones.map((zone) => ({
      id: zone.id,
      code: zone.code,
      name: zone.name,
      description: zone.description,
      status: zone.status,
      methods: zone.methods.map((method) => ({
        id: method.id,
        code: method.code,
        name: method.name,
        status: method.status,
        currencyCode: method.currencyCode as string,
        amount: Number(method.amount),
        minSubtotalAmount:
          method.minSubtotalAmount !== null ? Number(method.minSubtotalAmount) : null,
        maxSubtotalAmount:
          method.maxSubtotalAmount !== null ? Number(method.maxSubtotalAmount) : null,
        isDefault: method.isDefault,
      })),
    })),
  };
}
