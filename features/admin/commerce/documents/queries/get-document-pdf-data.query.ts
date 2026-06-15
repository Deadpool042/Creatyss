import "server-only";

import { db } from "@/core/db";
import { getDocumentTypeLabel } from "@/features/admin/commerce/documents/types/admin-order-document.types";
import type { DocumentPdfViewModel } from "@/features/admin/commerce/documents/types/document-pdf.types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

function joinAddress(parts: ReadonlyArray<string | null>): string | null {
  const value = parts.filter((p): p is string => p !== null && p.trim().length > 0).join(", ");
  return value.length > 0 ? value : null;
}

function fullName(first: string | null, last: string | null): string | null {
  const value = [first, last].filter((p): p is string => p !== null && p.length > 0).join(" ");
  return value.length > 0 ? value : null;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Construit le view-model PDF d'un document à partir de la commande + store. */
export async function getDocumentPdfData(
  storeId: string,
  documentId: string
): Promise<DocumentPdfViewModel | null> {
  const document = await db.document.findFirst({
    where: { id: documentId, storeId },
    select: {
      typeCode: true,
      documentNumber: true,
      issuedAt: true,
      createdAt: true,
      currencyCode: true,
      store: {
        select: {
          name: true,
          legalName: true,
          siret: true,
          vatNumber: true,
          addressLine1: true,
          addressPostalCode: true,
          addressCity: true,
          addressCountry: true,
        },
      },
      order: {
        select: {
          orderNumber: true,
          customerEmail: true,
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
              quantity: true,
              lineTotalAmount: true,
              lineTaxAmount: true,
              taxRatePercent: true,
            },
          },
        },
      },
    },
  });

  if (document === null || document.order === null) {
    return null;
  }

  const showTax = document.typeCode === "INVOICE" || document.typeCode === "CREDIT_NOTE";
  const billing = document.order.addresses[0] ?? null;
  const store = document.store;

  const lines = document.order.lines.map((line) => {
    const lineGross = Number(line.lineTotalAmount);
    const lineTax = Number(line.lineTaxAmount);
    return {
      name: [line.productName, line.variantName].filter(Boolean).join(" — "),
      quantity: line.quantity,
      lineGross,
      lineNet: showTax ? round2(lineGross - lineTax) : null,
      lineTax: showTax ? lineTax : null,
      ratePercent: line.taxRatePercent === null ? null : Number(line.taxRatePercent),
    };
  });

  const totals = lines.reduce(
    (acc, line) => ({
      net: round2(acc.net + (line.lineNet ?? 0)),
      tax: round2(acc.tax + (line.lineTax ?? 0)),
      gross: round2(acc.gross + line.lineGross),
    }),
    { net: 0, tax: 0, gross: 0 }
  );

  return {
    docType: document.typeCode,
    documentNumber: document.documentNumber,
    dateLabel: dateFormatter.format(document.issuedAt ?? document.createdAt),
    currency: document.currencyCode ?? "EUR",
    seller: {
      name: store.legalName ?? store.name,
      siret: store.siret,
      vatNumber: store.vatNumber,
      address: joinAddress([
        store.addressLine1,
        joinAddress([store.addressPostalCode, store.addressCity]),
        store.addressCountry,
      ]),
    },
    buyer: {
      name: billing?.company ?? fullName(billing?.firstName ?? null, billing?.lastName ?? null),
      email: document.order.customerEmail,
      address: joinAddress([
        billing?.line1 ?? null,
        billing?.line2 ?? null,
        joinAddress([billing?.postalCode ?? null, billing?.city ?? null]),
        billing?.countryCode ?? null,
      ]),
    },
    orderNumber: document.order.orderNumber,
    lines,
    totals,
    showTax,
  };
}

export { getDocumentTypeLabel };
