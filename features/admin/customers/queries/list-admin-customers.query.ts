import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminCustomerSummary = {
  id: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  status: string;
  isGuest: boolean;
  acceptsEmail: boolean;
  ordersCount: number;
  createdAt: string;
  lastSeenAt: string | null;
};

export async function listAdminCustomers(): Promise<readonly AdminCustomerSummary[]> {
  const storeId = await getCurrentStoreId();
  if (storeId === null) return [];

  const customers = await db.customer.findMany({
    where: { storeId, archivedAt: null, isGuest: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      firstName: true,
      lastName: true,
      phone: true,
      status: true,
      isGuest: true,
      acceptsEmail: true,
      createdAt: true,
      lastSeenAt: true,
      _count: { select: { orders: true } },
    },
    take: 200,
  });

  return customers.map((c) => ({
    id: c.id,
    email: c.email,
    displayName: c.displayName,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    status: c.status as string,
    isGuest: c.isGuest,
    acceptsEmail: c.acceptsEmail,
    ordersCount: c._count.orders,
    createdAt: c.createdAt.toISOString(),
    lastSeenAt: c.lastSeenAt?.toISOString() ?? null,
  }));
}
