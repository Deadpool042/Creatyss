import "server-only";

import { randomUUID } from "node:crypto";

import { withTransaction } from "@/core/db/transactions/with-transaction";
import { ACTIVE_RETURN_REQUEST_STATUSES } from "@/features/commerce/returns/domain/return-active-statuses";

export class CreateReturnRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateReturnRequestError";
  }
}

type ReturnLineInput = {
  orderLineId: string;
  quantity: number;
};

type CreateReturnRequestInput = {
  orderId: string;
  storeId: string;
  /** Lignes à retourner. Si absent → toutes les lignes (V1). */
  lines?: ReadonlyArray<ReturnLineInput>;
  /** Motif catégorisé de la demande (ex. origine storefront). Optionnel. */
  reasonCode?: string;
  /** Note libre associée à la demande. Optionnel. */
  notes?: string;
};

function generateReturnNumber(year: number): string {
  return `RET-${year}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

/**
 * Crée une demande de retour en statut REQUESTED. En mode partiel, seules les
 * lignes fournies sont incluses. Une seule demande active par commande.
 * Ne touche ni stock, ni paiement, ni statut commande.
 */
export async function createReturnRequest(input: CreateReturnRequestInput) {
  return withTransaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: input.orderId, storeId: input.storeId },
      select: {
        id: true,
        customerId: true,
        lines: {
          select: { id: true, quantity: true, productName: true, variantName: true, sku: true },
        },
      },
    });

    if (order === null) {
      throw new CreateReturnRequestError("Commande introuvable.");
    }

    if (order.lines.length === 0) {
      throw new CreateReturnRequestError("Commande sans ligne à retourner.");
    }

    const existing = await tx.returnRequest.findFirst({
      where: { orderId: input.orderId, status: { in: [...ACTIVE_RETURN_REQUEST_STATUSES] } },
      select: { id: true },
    });

    if (existing !== null) {
      throw new CreateReturnRequestError("Une demande de retour est déjà en cours.");
    }

    const lineMap = new Map(order.lines.map((l) => [l.id, l]));

    let itemsToCreate: ReadonlyArray<
      ReturnLineInput & { productName: string; variantName: string | null; sku: string | null }
    >;

    if (input.lines !== undefined && input.lines.length > 0) {
      itemsToCreate = input.lines.map((item) => {
        const line = lineMap.get(item.orderLineId);
        if (line === undefined) {
          throw new CreateReturnRequestError(`Ligne introuvable : ${item.orderLineId}.`);
        }
        if (item.quantity <= 0 || item.quantity > line.quantity) {
          throw new CreateReturnRequestError(
            `Quantité invalide pour la ligne ${item.orderLineId} (max ${line.quantity}).`
          );
        }
        return {
          ...item,
          productName: line.productName,
          variantName: line.variantName,
          sku: line.sku,
        };
      });
    } else {
      itemsToCreate = order.lines.map((l) => ({
        orderLineId: l.id,
        quantity: l.quantity,
        productName: l.productName,
        variantName: l.variantName,
        sku: l.sku,
      }));
    }

    return tx.returnRequest.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        customerId: order.customerId,
        returnNumber: generateReturnNumber(new Date().getFullYear()),
        status: "REQUESTED",
        reasonCode: input.reasonCode ?? null,
        notes: input.notes ?? null,
        requestedAt: new Date(),
        items: {
          create: itemsToCreate.map((item) => ({
            orderLine: { connect: { id: item.orderLineId } },
            quantity: item.quantity,
            productName: item.productName,
            variantName: item.variantName,
            sku: item.sku,
          })),
        },
      },
      select: { id: true, returnNumber: true },
    });
  });
}
