import "server-only";

import { db } from "@/core/db";
import type { AdminOrderDocumentSummary } from "@/features/admin/commerce/documents/types/admin-order-document.types";

export async function findDocumentsByOrderId(
  orderId: string
): Promise<AdminOrderDocumentSummary[]> {
  if (orderId.trim().length === 0) {
    return [];
  }

  const rows = await db.document.findMany({
    where: { orderId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      typeCode: true,
      status: true,
      documentNumber: true,
      issuedAt: true,
      createdAt: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    typeCode: row.typeCode,
    status: row.status,
    documentNumber: row.documentNumber,
    issuedAt: row.issuedAt,
    createdAt: row.createdAt,
  }));
}
