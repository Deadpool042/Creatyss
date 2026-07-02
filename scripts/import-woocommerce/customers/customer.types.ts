import { type CustomerStatus } from "../../../src/generated/prisma/client";

export type ImportedCustomerAddressInput = {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  line1: string;
  line2: string | null;
  postalCode: string;
  city: string;
  region: string | null;
  countryCode: string;
  phone: string | null;
};

export type ImportedCustomerInput = {
  externalId: string;
  sourceId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  status: CustomerStatus;
  isGuest: boolean;
  registeredAt: Date | null;
  billingAddress: ImportedCustomerAddressInput | null;
  shippingAddress: ImportedCustomerAddressInput | null;
};

export type ImportCustomersResult = {
  customerIdByExternalId: Map<string, string>;
  imported: number;
  updated: number;
  skipped: number;
};
