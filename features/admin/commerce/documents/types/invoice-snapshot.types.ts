/** Snapshot légal figé d'une facture à l'émission (cf. cadrage factures D2). */
export type InvoiceSnapshot = {
  schema: "creatyss.invoice.v1";
  issuedAt: string;
  orderNumber: string;
  currencyCode: string;
  seller: {
    legalName: string | null;
    siret: string | null;
    vatNumber: string | null;
    addressLine1: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
  };
  buyer: {
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    email: string | null;
    line1: string | null;
    line2: string | null;
    postalCode: string | null;
    city: string | null;
    countryCode: string | null;
  };
  lines: ReadonlyArray<{
    productName: string;
    variantName: string | null;
    sku: string | null;
    quantity: number;
    grossAmount: number;
    netAmount: number;
    taxAmount: number;
    taxRatePercent: number | null;
    taxTerritory: string | null;
  }>;
  totals: {
    netAmount: number;
    taxAmount: number;
    grossAmount: number;
  };
};
