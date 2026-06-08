import "server-only";

import { db } from "@/core/db";

export class CreateOrderConfirmationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateOrderConfirmationError";
  }
}

type CreateOrderConfirmationInput = {
  orderId: string;
  storeId: string;
};

export async function createOrderConfirmation(
  input: CreateOrderConfirmationInput
) {
  const order = await db.order.findUnique({
    where: { id: input.orderId },
    select: {
      id: true,
      orderNumber: true,
      currencyCode: true,
    },
  });

  if (order === null) {
    throw new CreateOrderConfirmationError("Commande introuvable.");
  }

  const existing = await db.document.findFirst({
    where: {
      orderId: input.orderId,
      typeCode: "ORDER_CONFIRMATION",
      status: { notIn: ["CANCELLED", "ARCHIVED"] },
    },
    select: { id: true },
  });

  if (existing !== null) {
    throw new CreateOrderConfirmationError(
      "Une confirmation existe déjà pour cette commande."
    );
  }

  const document = await db.document.create({
    data: {
      storeId: input.storeId,
      orderId: input.orderId,
      typeCode: "ORDER_CONFIRMATION",
      status: "GENERATED",
      title: `Confirmation commande #${order.orderNumber}`,
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
