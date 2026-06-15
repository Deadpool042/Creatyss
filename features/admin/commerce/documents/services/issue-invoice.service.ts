import "server-only";

import type { Prisma } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db/transactions/with-transaction";
import { allocateDocumentNumber } from "@/features/admin/commerce/documents/services/allocate-document-number.service";
import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

export class IssueInvoiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IssueInvoiceError";
  }
}

type IssueInvoiceInput = {
  orderId: string;
  storeId: string;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Émet une facture pour une commande : construit le snapshot légal figé, alloue
 * un numéro séquentiel sans trou et crée le `Document` INVOICE en statut ISSUED.
 * Une seule facture active par commande.
 */
export async function issueInvoice(input: IssueInvoiceInput) {
  return withTransaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        orderNumber: true,
        currencyCode: true,
        customerEmail: true,
        store: {
          select: {
            legalName: true,
            siret: true,
            vatNumber: true,
            addressLine1: true,
            addressPostalCode: true,
            addressCity: true,
            addressCountry: true,
          },
        },
        addresses: {
          where: { type: "BILLING" },
          select: {
            firstName: true,
            lastName: true,
            company: true,
            line1: true,
            line2: true,
            postalCode: true,
            city: true,
            countryCode: true,
          },
          take: 1,
        },
        lines: {
          select: {
            productName: true,
            variantName: true,
            sku: true,
            quantity: true,
            lineTotalAmount: true,
            lineTaxAmount: true,
            taxRatePercent: true,
            taxTerritory: true,
          },
        },
      },
    });

    if (order === null) {
      throw new IssueInvoiceError("Commande introuvable.");
    }

    const existing = await tx.document.findFirst({
      where: {
        orderId: input.orderId,
        typeCode: "INVOICE",
        status: { notIn: ["CANCELLED", "ARCHIVED"] },
      },
      select: { id: true },
    });

    if (existing !== null) {
      throw new IssueInvoiceError("Une facture existe déjà pour cette commande.");
    }

    const billing = order.addresses[0] ?? null;

    const lines = order.lines.map((line) => {
      const grossAmount = Number(line.lineTotalAmount);
      const taxAmount = Number(line.lineTaxAmount);
      return {
        productName: line.productName,
        variantName: line.variantName,
        sku: line.sku,
        quantity: line.quantity,
        grossAmount,
        netAmount: round2(grossAmount - taxAmount),
        taxAmount,
        taxRatePercent: line.taxRatePercent === null ? null : Number(line.taxRatePercent),
        taxTerritory: line.taxTerritory,
      };
    });

    const totals = lines.reduce(
      (acc, line) => ({
        netAmount: round2(acc.netAmount + line.netAmount),
        taxAmount: round2(acc.taxAmount + line.taxAmount),
        grossAmount: round2(acc.grossAmount + line.grossAmount),
      }),
      { netAmount: 0, taxAmount: 0, grossAmount: 0 }
    );

    const issuedAt = new Date();

    const snapshot: InvoiceSnapshot = {
      schema: "creatyss.invoice.v1",
      issuedAt: issuedAt.toISOString(),
      orderNumber: order.orderNumber,
      currencyCode: order.currencyCode,
      seller: {
        legalName: order.store.legalName,
        siret: order.store.siret,
        vatNumber: order.store.vatNumber,
        addressLine1: order.store.addressLine1,
        postalCode: order.store.addressPostalCode,
        city: order.store.addressCity,
        country: order.store.addressCountry,
      },
      buyer: {
        firstName: billing?.firstName ?? null,
        lastName: billing?.lastName ?? null,
        company: billing?.company ?? null,
        email: order.customerEmail,
        line1: billing?.line1 ?? null,
        line2: billing?.line2 ?? null,
        postalCode: billing?.postalCode ?? null,
        city: billing?.city ?? null,
        countryCode: billing?.countryCode ?? null,
      },
      lines,
      totals,
    };

    const { documentNumber } = await allocateDocumentNumber(tx, {
      storeId: input.storeId,
      typeCode: "INVOICE",
      year: issuedAt.getFullYear(),
    });

    return tx.document.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        typeCode: "INVOICE",
        status: "ISSUED",
        documentNumber,
        title: `Facture ${documentNumber}`,
        currencyCode: order.currencyCode,
        issuedAt,
        snapshot: snapshot as unknown as Prisma.InputJsonValue,
      },
    });
  });
}
