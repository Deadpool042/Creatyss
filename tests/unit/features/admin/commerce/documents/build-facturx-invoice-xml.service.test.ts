import { describe, expect, it } from "vitest";
import { buildFacturXInvoiceXml } from "@/features/admin/commerce/documents/services/build-facturx-invoice-xml.service";
import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

const SNAPSHOT: InvoiceSnapshot = {
  schema: "creatyss.invoice.v1",
  issuedAt: "2026-06-25T10:00:00.000Z",
  orderNumber: "CMD-2026-0001",
  currencyCode: "EUR",
  seller: {
    legalName: "Creatyss SAS",
    siret: "12345678900012",
    vatNumber: "FR12345678900",
    addressLine1: "1 rue de la Paix",
    postalCode: "75002",
    city: "Paris",
    country: "FR",
  },
  buyer: {
    firstName: "Jean",
    lastName: "Dupont",
    company: null,
    email: "jean.dupont@example.com",
    line1: "2 avenue des Champs",
    line2: null,
    postalCode: "69000",
    city: "Lyon",
    countryCode: "FR",
  },
  lines: [
    {
      productName: "Sac en cuir",
      variantName: null,
      sku: "SAC-001",
      quantity: 1,
      grossAmount: 120,
      netAmount: 100,
      taxAmount: 20,
      taxRatePercent: 20,
      taxTerritory: "FR",
    },
  ],
  totals: { netAmount: 100, taxAmount: 20, grossAmount: 120 },
};

describe("buildFacturXInvoiceXml", () => {
  it("produit un XML CII profil MINIMUM bien formé avec l'en-tête attendu", () => {
    const xml = buildFacturXInvoiceXml({ snapshot: SNAPSHOT, documentNumber: "FA-2026-0001" });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:minimum");
    expect(xml).toContain("<ram:ID>FA-2026-0001</ram:ID>");
    expect(xml).toContain("<ram:TypeCode>380</ram:TypeCode>");
    expect(xml).toContain('<udt:DateTimeString format="102">20260625</udt:DateTimeString>');
  });

  it("inclut le vendeur avec SIRET et numéro de TVA", () => {
    const xml = buildFacturXInvoiceXml({ snapshot: SNAPSHOT, documentNumber: "FA-2026-0001" });

    expect(xml).toContain("<ram:Name>Creatyss SAS</ram:Name>");
    expect(xml).toContain('<ram:ID schemeID="0002">12345678900012</ram:ID>');
    expect(xml).toContain('<ram:ID schemeID="VA">FR12345678900</ram:ID>');
  });

  it("construit le nom de l'acheteur à partir du prénom et du nom quand il n'y a pas de société", () => {
    const xml = buildFacturXInvoiceXml({ snapshot: SNAPSHOT, documentNumber: "FA-2026-0001" });

    expect(xml).toContain("<ram:Name>Jean Dupont</ram:Name>");
  });

  it("utilise le nom de société de l'acheteur quand il est renseigné", () => {
    const snapshot: InvoiceSnapshot = {
      ...SNAPSHOT,
      buyer: { ...SNAPSHOT.buyer, company: "Acme SARL" },
    };
    const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

    expect(xml).toContain("<ram:Name>Acme SARL</ram:Name>");
    expect(xml).not.toContain("<ram:Name>Jean Dupont</ram:Name>");
  });

  it("reporte les totaux HT, TVA et TTC formatés à 2 décimales", () => {
    const xml = buildFacturXInvoiceXml({ snapshot: SNAPSHOT, documentNumber: "FA-2026-0001" });

    expect(xml).toContain("<ram:TaxBasisTotalAmount>100.00</ram:TaxBasisTotalAmount>");
    expect(xml).toContain('<ram:TaxTotalAmount currencyID="EUR">20.00</ram:TaxTotalAmount>');
    expect(xml).toContain("<ram:GrandTotalAmount>120.00</ram:GrandTotalAmount>");
    expect(xml).toContain("<ram:DuePayableAmount>120.00</ram:DuePayableAmount>");
  });

  it("échappe les caractères XML spéciaux dans les champs texte", () => {
    const snapshot: InvoiceSnapshot = {
      ...SNAPSHOT,
      seller: { ...SNAPSHOT.seller, legalName: "Maison <Dupont> & Fils" },
    };
    const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

    expect(xml).toContain("<ram:Name>Maison &lt;Dupont&gt; &amp; Fils</ram:Name>");
    expect(xml).not.toContain("<Dupont>");
  });

  it("omet les champs null sans casser la structure (vendeur/acheteur incomplets)", () => {
    const snapshot: InvoiceSnapshot = {
      ...SNAPSHOT,
      seller: {
        legalName: null,
        siret: null,
        vatNumber: null,
        addressLine1: null,
        postalCode: null,
        city: null,
        country: null,
      },
      buyer: {
        firstName: null,
        lastName: null,
        company: null,
        email: null,
        line1: null,
        line2: null,
        postalCode: null,
        city: null,
        countryCode: null,
      },
    };

    const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

    expect(xml).toContain("<ram:SellerTradeParty></ram:SellerTradeParty>");
    expect(xml).toContain("<ram:BuyerTradeParty></ram:BuyerTradeParty>");
  });
});
