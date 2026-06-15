import type { DocumentTypeCode } from "@/prisma-generated/client";

export type DocumentPdfLine = {
  name: string;
  quantity: number;
  lineGross: number;
  lineNet: number | null;
  lineTax: number | null;
  ratePercent: number | null;
};

export type DocumentPdfViewModel = {
  docType: DocumentTypeCode;
  documentNumber: string | null;
  dateLabel: string;
  currency: string;
  seller: {
    name: string | null;
    siret: string | null;
    vatNumber: string | null;
    address: string | null;
  };
  buyer: {
    name: string | null;
    email: string | null;
    address: string | null;
  };
  orderNumber: string;
  lines: ReadonlyArray<DocumentPdfLine>;
  totals: { net: number; tax: number; gross: number };
  /** Vrai si la TVA doit être détaillée (facture). */
  showTax: boolean;
};
