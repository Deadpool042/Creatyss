import { NextResponse } from "next/server";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    await requireAdminCapability("admin.commerce.customers.read");
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { customerId } = await params;
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return NextResponse.json({ error: "Boutique introuvable" }, { status: 404 });
  }

  const [customer, consentRecords] = await Promise.all([
    db.customer.findFirst({
      where: { id: customerId, storeId, archivedAt: null, isGuest: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        phone: true,
        status: true,
        acceptsEmail: true,
        acceptsSms: true,
        notes: true,
        firstSeenAt: true,
        lastSeenAt: true,
        activatedAt: true,
        createdAt: true,
        addresses: {
          where: { archivedAt: null, isActive: true },
          select: {
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
          },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          select: {
            orderNumber: true,
            status: true,
            totalAmount: true,
            currencyCode: true,
            placedAt: true,
          },
        },
      },
    }),
    db.consentRecord.findMany({
      where: { subjectType: "CUSTOMER", subjectId: customerId },
      select: {
        status: true,
        grantedAt: true,
        revokedAt: true,
        deniedAt: true,
        purpose: { select: { code: true, name: true } },
      },
    }),
  ]);

  if (customer === null) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    customer: {
      ...customer,
      consentRecords,
    },
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="client-${customerId}-rgpd.json"`,
    },
  });
}
