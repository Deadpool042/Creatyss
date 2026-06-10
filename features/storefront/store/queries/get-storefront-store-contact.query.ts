import { db } from "@/core/db";

export type StorefrontStoreContact = {
  supportEmail: string | null;
  supportPhone: string | null;
  addressLine1: string | null;
  addressPostalCode: string | null;
  addressCity: string | null;
  addressCountry: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
};

const EMPTY_CONTACT: StorefrontStoreContact = {
  supportEmail: null,
  supportPhone: null,
  addressLine1: null,
  addressPostalCode: null,
  addressCity: null,
  addressCountry: null,
  instagramUrl: null,
  facebookUrl: null,
};

export async function getStorefrontStoreContact(): Promise<StorefrontStoreContact> {
  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: {
      supportEmail: true,
      supportPhone: true,
      addressLine1: true,
      addressPostalCode: true,
      addressCity: true,
      addressCountry: true,
      instagramUrl: true,
      facebookUrl: true,
    },
  });

  if (!store) return EMPTY_CONTACT;

  return {
    supportEmail: store.supportEmail ?? null,
    supportPhone: store.supportPhone ?? null,
    addressLine1: store.addressLine1 ?? null,
    addressPostalCode: store.addressPostalCode ?? null,
    addressCity: store.addressCity ?? null,
    addressCountry: store.addressCountry ?? null,
    instagramUrl: store.instagramUrl ?? null,
    facebookUrl: store.facebookUrl ?? null,
  };
}
