import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { Prisma } from "@/src/generated/prisma/client";

const ADMIN_CUSTOMER_DETAIL_SELECT = {
  id: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  phone: true,
  status: true,
  acceptsEmail: true,
  acceptsSms: true,
  notes: true,
  firstSeenAt: true,
  lastSeenAt: true,
  activatedAt: true,
  blockedAt: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    where: {
      archivedAt: null,
      isActive: true,
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      type: true,
      label: true,
      firstName: true,
      lastName: true,
      company: true,
      line1: true,
      line2: true,
      postalCode: true,
      city: true,
      region: true,
      countryCode: true,
      phone: true,
      isDefault: true,
    },
  },
  orders: {
    orderBy: [{ createdAt: "desc" }],
    take: 6,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      totalAmount: true,
      currencyCode: true,
      createdAt: true,
      placedAt: true,
    },
  },
  _count: {
    select: {
      orders: true,
      addresses: true,
    },
  },
} satisfies Prisma.CustomerSelect;

export type AdminCustomerConsentRecord = {
  id: string;
  status: "GRANTED" | "DENIED" | "REVOKED" | "EXPIRED";
  grantedAt: Date | null;
  revokedAt: Date | null;
  deniedAt: Date | null;
  purpose: { code: string; name: string };
};

export async function getAdminCustomerDetail(customerId: string) {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return null;
  }

  const [customer, consentRecords] = await Promise.all([
    db.customer.findFirst({
      where: {
        id: customerId,
        storeId,
        archivedAt: null,
        isGuest: false,
      },
      select: ADMIN_CUSTOMER_DETAIL_SELECT,
    }),
    db.consentRecord.findMany({
      where: {
        subjectType: "CUSTOMER",
        subjectId: customerId,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        grantedAt: true,
        revokedAt: true,
        deniedAt: true,
        purpose: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    }),
  ]);

  if (customer === null) {
    return null;
  }

  return { ...customer, consentRecords: consentRecords as AdminCustomerConsentRecord[] };
}
