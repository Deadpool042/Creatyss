import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

type BuildFacturXInvoiceXmlInput = {
  snapshot: InvoiceSnapshot;
  documentNumber: string;
};

const FACTURX_MINIMUM_GUIDELINE_ID =
  "urn:cen.eu:en16931:2017#conformant#urn:factur-x.eu:1p0:minimum";
const INVOICE_TYPE_CODE = "380";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatAmount(value: number): string {
  return value.toFixed(2);
}

function formatDateCompact(isoDate: string): string {
  return isoDate.slice(0, 10).replaceAll("-", "");
}

function buildPostalTradeAddress(address: {
  line1: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}): string {
  const parts: string[] = [];
  if (address.postalCode !== null)
    parts.push(`<ram:PostcodeCode>${escapeXml(address.postalCode)}</ram:PostcodeCode>`);
  if (address.line1 !== null) parts.push(`<ram:LineOne>${escapeXml(address.line1)}</ram:LineOne>`);
  if (address.city !== null) parts.push(`<ram:CityName>${escapeXml(address.city)}</ram:CityName>`);
  if (address.country !== null)
    parts.push(`<ram:CountryID>${escapeXml(address.country)}</ram:CountryID>`);

  if (parts.length === 0) return "";
  return `<ram:PostalTradeAddress>${parts.join("")}</ram:PostalTradeAddress>`;
}

function buildSellerTradeParty(seller: InvoiceSnapshot["seller"]): string {
  const parts: string[] = [];
  if (seller.legalName !== null) parts.push(`<ram:Name>${escapeXml(seller.legalName)}</ram:Name>`);
  if (seller.siret !== null) {
    parts.push(
      `<ram:SpecifiedLegalOrganization><ram:ID schemeID="0002">${escapeXml(seller.siret)}</ram:ID></ram:SpecifiedLegalOrganization>`
    );
  }
  parts.push(
    buildPostalTradeAddress({
      line1: seller.addressLine1,
      postalCode: seller.postalCode,
      city: seller.city,
      country: seller.country,
    })
  );
  if (seller.vatNumber !== null) {
    parts.push(
      `<ram:SpecifiedTaxRegistration><ram:ID schemeID="VA">${escapeXml(seller.vatNumber)}</ram:ID></ram:SpecifiedTaxRegistration>`
    );
  }

  return `<ram:SellerTradeParty>${parts.join("")}</ram:SellerTradeParty>`;
}

function buildBuyerName(buyer: InvoiceSnapshot["buyer"]): string | null {
  if (buyer.company !== null) return buyer.company;
  const fullName = [buyer.firstName, buyer.lastName].filter((part) => part !== null).join(" ");
  return fullName.length > 0 ? fullName : null;
}

function buildBuyerTradeParty(buyer: InvoiceSnapshot["buyer"]): string {
  const parts: string[] = [];
  const name = buildBuyerName(buyer);
  if (name !== null) parts.push(`<ram:Name>${escapeXml(name)}</ram:Name>`);
  parts.push(
    buildPostalTradeAddress({
      line1: buyer.line1,
      postalCode: buyer.postalCode,
      city: buyer.city,
      country: buyer.countryCode,
    })
  );

  return `<ram:BuyerTradeParty>${parts.join("")}</ram:BuyerTradeParty>`;
}

/**
 * Génère le XML Factur-X (CII, profil MINIMUM) à partir du snapshot légal
 * figé d'une facture. Profil MINIMUM = en-tête seul, sans détail des lignes
 * (cf. spec Factur-X 1.0 §profils) — la version BASIC avec lignes est un
 * incrément ultérieur du lot.
 */
export function buildFacturXInvoiceXml(input: BuildFacturXInvoiceXmlInput): string {
  const { snapshot, documentNumber } = input;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">',
    "<rsm:ExchangedDocumentContext>",
    `<ram:GuidelineSpecifiedDocumentContextParameter><ram:ID>${FACTURX_MINIMUM_GUIDELINE_ID}</ram:ID></ram:GuidelineSpecifiedDocumentContextParameter>`,
    "</rsm:ExchangedDocumentContext>",
    "<rsm:ExchangedDocument>",
    `<ram:ID>${escapeXml(documentNumber)}</ram:ID>`,
    `<ram:TypeCode>${INVOICE_TYPE_CODE}</ram:TypeCode>`,
    `<ram:IssueDateTime><udt:DateTimeString format="102">${formatDateCompact(snapshot.issuedAt)}</udt:DateTimeString></ram:IssueDateTime>`,
    "</rsm:ExchangedDocument>",
    "<rsm:SupplyChainTradeTransaction>",
    "<ram:ApplicableHeaderTradeAgreement>",
    buildSellerTradeParty(snapshot.seller),
    buildBuyerTradeParty(snapshot.buyer),
    "</ram:ApplicableHeaderTradeAgreement>",
    "<ram:ApplicableHeaderTradeDelivery/>",
    "<ram:ApplicableHeaderTradeSettlement>",
    `<ram:InvoiceCurrencyCode>${escapeXml(snapshot.currencyCode)}</ram:InvoiceCurrencyCode>`,
    "<ram:SpecifiedTradeSettlementHeaderMonetarySummation>",
    `<ram:TaxBasisTotalAmount>${formatAmount(snapshot.totals.netAmount)}</ram:TaxBasisTotalAmount>`,
    `<ram:TaxTotalAmount currencyID="${escapeXml(snapshot.currencyCode)}">${formatAmount(snapshot.totals.taxAmount)}</ram:TaxTotalAmount>`,
    `<ram:GrandTotalAmount>${formatAmount(snapshot.totals.grossAmount)}</ram:GrandTotalAmount>`,
    `<ram:DuePayableAmount>${formatAmount(snapshot.totals.grossAmount)}</ram:DuePayableAmount>`,
    "</ram:SpecifiedTradeSettlementHeaderMonetarySummation>",
    "</ram:ApplicableHeaderTradeSettlement>",
    "</rsm:SupplyChainTradeTransaction>",
    "</rsm:CrossIndustryInvoice>",
  ].join("");
}
