import {
  CurrencyCode,
  PriceStatus,
  RoleScopeType,
  RoleStatus,
  StoreStatus,
  type PrismaClient,
} from "@prisma/client";

export const DEFAULT_STORE_CODE = "creatyss";
export const DEFAULT_STORE_NAME = "Creatyss";
export const DEFAULT_STORE_SLUG = "creatyss";
export const DEFAULT_PRICE_LIST_CODE = "default";
export const DEFAULT_PRICE_LIST_NAME = "Tarif standard";
export const DEFAULT_ADMIN_ROLE_CODE = "store_owner";
export const DEFAULT_ADMIN_ROLE_NAME = "Responsable boutique";

export async function ensureDefaultStore(prisma: PrismaClient) {
  return prisma.store.upsert({
    where: {
      code: DEFAULT_STORE_CODE,
    },
    update: {
      name: DEFAULT_STORE_NAME,
      slug: DEFAULT_STORE_SLUG,
      status: StoreStatus.ACTIVE,
      defaultLocale: "fr-FR",
      defaultCurrency: "EUR",
      defaultCountryCode: "FR",
      timezone: "Europe/Paris",
      brandName: DEFAULT_STORE_NAME,
      legalName: DEFAULT_STORE_NAME,
      contactEmail: process.env.EMAIL_FROM ?? null,
      supportEmail: process.env.EMAIL_FROM ?? null,
    },
    create: {
      code: DEFAULT_STORE_CODE,
      name: DEFAULT_STORE_NAME,
      slug: DEFAULT_STORE_SLUG,
      status: StoreStatus.ACTIVE,
      defaultLocale: "fr-FR",
      defaultCurrency: "EUR",
      defaultCountryCode: "FR",
      timezone: "Europe/Paris",
      brandName: DEFAULT_STORE_NAME,
      legalName: DEFAULT_STORE_NAME,
      contactEmail: process.env.EMAIL_FROM ?? null,
      supportEmail: process.env.EMAIL_FROM ?? null,
    },
  });
}

export async function ensureDefaultPriceList(prisma: PrismaClient, storeId: string) {
  return prisma.priceList.upsert({
    where: {
      storeId_code: {
        storeId,
        code: DEFAULT_PRICE_LIST_CODE,
      },
    },
    update: {
      name: DEFAULT_PRICE_LIST_NAME,
      description: "Tarif principal local pour le catalogue Creatyss.",
      currencyCode: CurrencyCode.EUR,
      isDefault: true,
      status: PriceStatus.ACTIVE,
    },
    create: {
      storeId,
      code: DEFAULT_PRICE_LIST_CODE,
      name: DEFAULT_PRICE_LIST_NAME,
      description: "Tarif principal local pour le catalogue Creatyss.",
      currencyCode: CurrencyCode.EUR,
      isDefault: true,
      status: PriceStatus.ACTIVE,
    },
  });
}

export async function ensureDefaultAdminRole(prisma: PrismaClient, storeId: string) {
  return prisma.role.upsert({
    where: {
      storeId_code: {
        storeId,
        code: DEFAULT_ADMIN_ROLE_CODE,
      },
    },
    update: {
      name: DEFAULT_ADMIN_ROLE_NAME,
      description: "Rôle système de développement pour administrer la boutique locale.",
      scopeType: RoleScopeType.STORE,
      status: RoleStatus.ACTIVE,
      isSystemRole: true,
    },
    create: {
      storeId,
      code: DEFAULT_ADMIN_ROLE_CODE,
      name: DEFAULT_ADMIN_ROLE_NAME,
      description: "Rôle système de développement pour administrer la boutique locale.",
      scopeType: RoleScopeType.STORE,
      status: RoleStatus.ACTIVE,
      isSystemRole: true,
    },
  });
}
