import { db } from "@/core/db";
import type { CurrencyCodeValue } from "@/features/admin/settings/schemas/store-settings.schema";

export type AdminStoreSettings = {
  id: string;
  code: string;
  slug: string;
  name: string;
  legalName: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  shippingReturnsPolicy: string | null;
  defaultCurrency: CurrencyCodeValue;
  timezone: string;
  defaultLocaleCode: string;
  status: string;
  isProduction: boolean;
  updatedAt: string;
};

export async function getAdminStoreSettings(): Promise<AdminStoreSettings | null> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      code: true,
      slug: true,
      name: true,
      legalName: true,
      supportEmail: true,
      supportPhone: true,
      shippingReturnsPolicy: true,
      defaultCurrency: true,
      timezone: true,
      defaultLocaleCode: true,
      status: true,
      isProduction: true,
      updatedAt: true,
    },
  });

  if (!store) return null;

  return {
    ...store,
    defaultCurrency: store.defaultCurrency as CurrencyCodeValue,
    status: store.status as string,
    updatedAt: store.updatedAt.toISOString(),
  };
}
