import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { getDocumentTypeLabel } from "@/features/admin/commerce/documents/types/admin-order-document.types";
import type { DocumentPdfViewModel } from "@/features/admin/commerce/documents/types/document-pdf.types";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 50;
const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.4, 0.4, 0.45);

function money(value: number, currency: string): string {
  return `${value.toFixed(2)} ${currency}`;
}

/** Génère un PDF simple pour un document (confirmation, bon, facture). */
export async function renderDocumentPdf(vm: DocumentPdfViewModel): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage(A4);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const width = page.getWidth();
  const height = page.getHeight();
  let y = height - MARGIN;

  const text = (
    value: string,
    x: number,
    yPos: number,
    opts?: { size?: number; bold?: boolean; color?: typeof INK }
  ): void => {
    page.drawText(value, {
      x,
      y: yPos,
      size: opts?.size ?? 10,
      font: opts?.bold ? bold : font,
      color: opts?.color ?? INK,
    });
  };

  // En-tête : titre du document
  const title = getDocumentTypeLabel(vm.docType);
  text(title, MARGIN, y, { size: 20, bold: true });
  if (vm.documentNumber) {
    text(vm.documentNumber, width - MARGIN - bold.widthOfTextAtSize(vm.documentNumber, 12), y + 4, {
      size: 12,
      bold: true,
    });
  }
  y -= 18;
  text(`Commande ${vm.orderNumber} · ${vm.dateLabel}`, MARGIN, y, { size: 9, color: MUTED });
  y -= 30;

  // Vendeur (gauche) / Acheteur (droite)
  const colRight = width / 2 + 10;
  let yLeft = y;
  let yRight = y;
  text("Émetteur", MARGIN, yLeft, { size: 8, bold: true, color: MUTED });
  text("Destinataire", colRight, yRight, { size: 8, bold: true, color: MUTED });
  yLeft -= 14;
  yRight -= 14;

  const sellerLines = [
    vm.seller.name,
    vm.seller.address,
    vm.seller.siret ? `SIRET ${vm.seller.siret}` : null,
    vm.seller.vatNumber ? `TVA ${vm.seller.vatNumber}` : null,
  ].filter((l): l is string => l !== null);
  for (const line of sellerLines) {
    text(line, MARGIN, yLeft, { size: 9 });
    yLeft -= 13;
  }

  const buyerLines = [vm.buyer.name, vm.buyer.address, vm.buyer.email].filter(
    (l): l is string => l !== null
  );
  for (const line of buyerLines) {
    text(line, colRight, yRight, { size: 9 });
    yRight -= 13;
  }

  y = Math.min(yLeft, yRight) - 24;

  // Tableau des lignes
  const colQty = width - MARGIN - 220;
  const colRate = width - MARGIN - 150;
  const colAmount = width - MARGIN - 70;
  text("Article", MARGIN, y, { size: 8, bold: true, color: MUTED });
  text("Qté", colQty, y, { size: 8, bold: true, color: MUTED });
  if (vm.showTax) text("TVA", colRate, y, { size: 8, bold: true, color: MUTED });
  text(vm.showTax ? "TTC" : "Montant", colAmount, y, { size: 8, bold: true, color: MUTED });
  y -= 6;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: width - MARGIN, y },
    thickness: 0.5,
    color: MUTED,
  });
  y -= 16;

  for (const line of vm.lines) {
    const name = line.name.length > 48 ? `${line.name.slice(0, 47)}…` : line.name;
    text(name, MARGIN, y, { size: 9 });
    text(String(line.quantity), colQty, y, { size: 9 });
    if (vm.showTax && line.ratePercent !== null) {
      text(`${line.ratePercent} %`, colRate, y, { size: 9 });
    }
    text(money(line.lineGross, vm.currency), colAmount, y, { size: 9 });
    y -= 15;
  }

  y -= 10;
  page.drawLine({
    start: { x: colRate, y: y + 6 },
    end: { x: width - MARGIN, y: y + 6 },
    thickness: 0.5,
    color: MUTED,
  });

  if (vm.showTax) {
    text("Total HT", colRate, y, { size: 9, color: MUTED });
    text(money(vm.totals.net, vm.currency), colAmount, y, { size: 9 });
    y -= 14;
    text("TVA", colRate, y, { size: 9, color: MUTED });
    text(money(vm.totals.tax, vm.currency), colAmount, y, { size: 9 });
    y -= 14;
  }
  text("Total TTC", colRate, y, { size: 10, bold: true });
  text(money(vm.totals.gross, vm.currency), colAmount, y, { size: 10, bold: true });

  return pdf.save();
}
