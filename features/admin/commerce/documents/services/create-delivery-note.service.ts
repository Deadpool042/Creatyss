import "server-only";

import { db } from "@/core/db";

export class CreateDeliveryNoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateDeliveryNoteError";
  }
}

type CreateDeliveryNoteInput = {
  orderId: string;
  storeId: string;
};

export async function createDeliveryNote(input: CreateDeliveryNoteInput) {
  const order = await db.order.findUnique({
    where: { id: input.orderId },
    select: {
      id: true,
      orderNumber: true,
      currencyCode: true,
    },
  });

  if (order === null) {
    throw new CreateDeliveryNoteError("Commande introuvable.");
  }

  const existing = await db.document.findFirst({
    where: {
      orderId: input.orderId,
      typeCode: "DELIVERY_NOTE",
      status: { notIn: ["CANCELLED", "ARCHIVED"] },
    },
    select: { id: true },
  });

  if (existing !== null) {
    throw new CreateDeliveryNoteError(
      "Un bon de préparation existe déjà pour cette commande."
    );
  }

  const document = await db.document.create({
    data: {
      storeId: input.storeId,
      orderId: input.orderId,
      typeCode: "DELIVERY_NOTE",
      status: "GENERATED",
      title: `Bon de préparation — Commande #${order.orderNumber}`,
      currencyCode: order.currencyCode,
      issuedAt: new Date(),
      documentNumber: null,
      storageKey: null,
      publicUrl: null,
      fileName: null,
      mimeType: null,
    },
  });

  return document;
}
