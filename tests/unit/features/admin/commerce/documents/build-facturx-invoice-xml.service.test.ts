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

const TWO_LINES_SNAPSHOT_AT_DIFFERENT_RATES: InvoiceSnapshot = {
  ...SNAPSHOT,
  lines: [
    {
      productName: "Sac en cuir",
      variantName: null,
      sku: "SAC-001",
      quantity: 1,
      grossAmount: 240,
      netAmount: 200,
      taxAmount: 40,
      taxRatePercent: 20,
      taxTerritory: "FR",
    },
    {
      productName: "Livre d'entretien cuir",
      variantName: null,
      sku: "LIV-003",
      quantity: 1,
      grossAmount: 52.75,
      netAmount: 50,
      taxAmount: 2.75,
      taxRatePercent: 5.5,
      taxTerritory: "FR",
    },
  ],
  totals: { netAmount: 250, taxAmount: 42.75, grossAmount: 292.75 },
};

describe("buildFacturXInvoiceXml", () => {
  it("produit un XML CII profil BASIC bien formé avec l'en-tête attendu", () => {
    const xml = buildFacturXInvoiceXml({ snapshot: SNAPSHOT, documentNumber: "FA-2026-0001" });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:basic");
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

  describe("lignes de facture (profil BASIC)", () => {
    const TWO_LINES_SNAPSHOT: InvoiceSnapshot = {
      ...SNAPSHOT,
      lines: [
        {
          productName: "Sac en cuir",
          variantName: null,
          sku: "SAC-001",
          quantity: 2,
          grossAmount: 240,
          netAmount: 200,
          taxAmount: 40,
          taxRatePercent: 20,
          taxTerritory: "FR",
        },
        {
          productName: "Ceinture <édition limitée> & cuir",
          variantName: null,
          sku: "CEI-002",
          quantity: 1,
          grossAmount: 60,
          netAmount: 50,
          taxAmount: 10,
          taxRatePercent: 20,
          taxTerritory: "FR",
        },
      ],
    };

    it("inclut une ligne par article du snapshot", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT,
        documentNumber: "FA-2026-0001",
      });

      expect(xml.match(/<ram:IncludedSupplyChainTradeLineItem>/g)).toHaveLength(2);
      expect(xml).toContain("<ram:LineID>1</ram:LineID>");
      expect(xml).toContain("<ram:LineID>2</ram:LineID>");
    });

    it("reporte la quantité de chaque ligne", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT,
        documentNumber: "FA-2026-0001",
      });

      expect(xml).toContain('<ram:BilledQuantity unitCode="C62">2</ram:BilledQuantity>');
      expect(xml).toContain('<ram:BilledQuantity unitCode="C62">1</ram:BilledQuantity>');
    });

    it("calcule le prix unitaire net (netAmount / quantity)", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT,
        documentNumber: "FA-2026-0001",
      });

      expect(xml).toContain("<ram:ChargeAmount>100.00</ram:ChargeAmount>");
      expect(xml).toContain("<ram:ChargeAmount>50.00</ram:ChargeAmount>");
    });

    it("reporte le total net de chaque ligne", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT,
        documentNumber: "FA-2026-0001",
      });

      expect(xml).toContain("<ram:LineTotalAmount>200.00</ram:LineTotalAmount>");
      expect(xml).toContain("<ram:LineTotalAmount>50.00</ram:LineTotalAmount>");
    });

    it("reporte le taux et le montant de TVA de chaque ligne", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT,
        documentNumber: "FA-2026-0001",
      });

      expect(xml).toContain("<ram:RateApplicablePercent>20.00</ram:RateApplicablePercent>");
      expect(xml).toContain("<ram:CalculatedAmount>40.00</ram:CalculatedAmount>");
      expect(xml).toContain("<ram:CalculatedAmount>10.00</ram:CalculatedAmount>");
    });

    it("échappe les caractères XML spéciaux dans le libellé d'une ligne", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT,
        documentNumber: "FA-2026-0001",
      });

      expect(xml).toContain("<ram:Name>Ceinture &lt;édition limitée&gt; &amp; cuir</ram:Name>");
      expect(xml).not.toContain("<édition limitée>");
    });

    it("omet le bloc ApplicableTradeTax au niveau ligne quand le taux de TVA est absent", () => {
      const snapshot: InvoiceSnapshot = {
        ...SNAPSHOT,
        lines: [{ ...SNAPSHOT.lines[0], taxRatePercent: null }],
      };
      const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

      expect(xml).toContain("<ram:IncludedSupplyChainTradeLineItem>");
      const lineItemXml = xml.slice(
        xml.indexOf("<ram:IncludedSupplyChainTradeLineItem>"),
        xml.indexOf("</ram:IncludedSupplyChainTradeLineItem>")
      );
      expect(lineItemXml).not.toContain("<ram:ApplicableTradeTax>");
    });

    it("classe une ligne au taux 0% en catégorie Z (taux zéro) plutôt que S", () => {
      const snapshot: InvoiceSnapshot = {
        ...SNAPSHOT,
        lines: [{ ...SNAPSHOT.lines[0], taxAmount: 0, taxRatePercent: 0 }],
      };
      const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

      const lineItemXml = xml.slice(
        xml.indexOf("<ram:IncludedSupplyChainTradeLineItem>"),
        xml.indexOf("</ram:IncludedSupplyChainTradeLineItem>")
      );
      expect(lineItemXml).toContain("<ram:CategoryCode>Z</ram:CategoryCode>");
      expect(lineItemXml).toContain("<ram:RateApplicablePercent>0.00</ram:RateApplicablePercent>");
    });
  });

  describe("ventilation TVA agrégée au niveau document (profil BASIC)", () => {
    it("agrège plusieurs lignes au même taux dans un seul ApplicableTradeTax", () => {
      const snapshot: InvoiceSnapshot = {
        ...SNAPSHOT,
        lines: [
          { ...SNAPSHOT.lines[0], netAmount: 100, taxAmount: 20, taxRatePercent: 20 },
          { ...SNAPSHOT.lines[0], netAmount: 50, taxAmount: 10, taxRatePercent: 20 },
        ],
      };
      const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

      const headerXml = xml.slice(
        xml.indexOf("<ram:ApplicableHeaderTradeSettlement>"),
        xml.indexOf("</ram:ApplicableHeaderTradeSettlement>")
      );
      expect(headerXml.match(/<ram:ApplicableTradeTax>/g)).toHaveLength(1);
      expect(headerXml).toContain("<ram:BasisAmount>150.00</ram:BasisAmount>");
      expect(headerXml).toContain("<ram:CalculatedAmount>30.00</ram:CalculatedAmount>");
      expect(headerXml).toContain("<ram:RateApplicablePercent>20.00</ram:RateApplicablePercent>");
    });

    it("sépare deux taux de TVA différents en deux blocs distincts", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT_AT_DIFFERENT_RATES,
        documentNumber: "FA-2026-0001",
      });

      const headerXml = xml.slice(
        xml.indexOf("<ram:ApplicableHeaderTradeSettlement>"),
        xml.indexOf("</ram:ApplicableHeaderTradeSettlement>")
      );
      expect(headerXml.match(/<ram:ApplicableTradeTax>/g)).toHaveLength(2);
      expect(headerXml).toContain("<ram:RateApplicablePercent>20.00</ram:RateApplicablePercent>");
      expect(headerXml).toContain("<ram:RateApplicablePercent>5.50</ram:RateApplicablePercent>");
    });

    it("reporte la base taxable HT (BasisAmount) par taux", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT_AT_DIFFERENT_RATES,
        documentNumber: "FA-2026-0001",
      });

      expect(xml).toContain("<ram:BasisAmount>200.00</ram:BasisAmount>");
      expect(xml).toContain("<ram:BasisAmount>50.00</ram:BasisAmount>");
    });

    it("reporte le montant de TVA (CalculatedAmount) par taux", () => {
      const xml = buildFacturXInvoiceXml({
        snapshot: TWO_LINES_SNAPSHOT_AT_DIFFERENT_RATES,
        documentNumber: "FA-2026-0001",
      });

      const headerXml = xml.slice(
        xml.indexOf("<ram:ApplicableHeaderTradeSettlement>"),
        xml.indexOf("</ram:ApplicableHeaderTradeSettlement>")
      );
      expect(headerXml).toContain("<ram:CalculatedAmount>40.00</ram:CalculatedAmount>");
      expect(headerXml).toContain("<ram:CalculatedAmount>2.75</ram:CalculatedAmount>");
    });

    it("regroupe les lignes exonérées (taux null) dans une catégorie E sans taux", () => {
      const snapshot: InvoiceSnapshot = {
        ...SNAPSHOT,
        lines: [{ ...SNAPSHOT.lines[0], netAmount: 30, taxAmount: 0, taxRatePercent: null }],
      };
      const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

      const headerXml = xml.slice(
        xml.indexOf("<ram:ApplicableHeaderTradeSettlement>"),
        xml.indexOf("</ram:ApplicableHeaderTradeSettlement>")
      );
      expect(headerXml).toContain("<ram:CategoryCode>E</ram:CategoryCode>");
      expect(headerXml).toContain("<ram:BasisAmount>30.00</ram:BasisAmount>");
      expect(headerXml).toContain("<ram:CalculatedAmount>0.00</ram:CalculatedAmount>");
      expect(headerXml).not.toContain("<ram:RateApplicablePercent>");
    });

    it("regroupe les lignes au taux 0% dans une catégorie Z avec un taux à 0.00", () => {
      const snapshot: InvoiceSnapshot = {
        ...SNAPSHOT,
        lines: [{ ...SNAPSHOT.lines[0], netAmount: 30, taxAmount: 0, taxRatePercent: 0 }],
      };
      const xml = buildFacturXInvoiceXml({ snapshot, documentNumber: "FA-2026-0001" });

      const headerXml = xml.slice(
        xml.indexOf("<ram:ApplicableHeaderTradeSettlement>"),
        xml.indexOf("</ram:ApplicableHeaderTradeSettlement>")
      );
      expect(headerXml).toContain("<ram:CategoryCode>Z</ram:CategoryCode>");
      expect(headerXml).toContain("<ram:RateApplicablePercent>0.00</ram:RateApplicablePercent>");
    });
  });
});
