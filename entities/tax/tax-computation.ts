/**
 * Ventilation TVA d'un montant TTC.
 *
 * Logique de domaine pure (aucune dépendance Prisma / base / framework).
 * Cf. docs/lots/2026-06-14-commerce-taxation-cadrage.md :
 *  - D1 : assiette TTC (le prix saisi est le prix de vente consommateur).
 *  - D5 : arrondi par ligne, demi-supérieur, 2 décimales ; HT + TVA = TTC exact.
 *
 * Convention : on ventile un montant TTC déjà arrondi (prix de ligne) en part
 * HT et part TVA. On ne recalcule jamais le TTC ; il est la donnée d'entrée.
 */

export type LineTaxBreakdown = {
  /** Montant TTC (donnée d'entrée, inchangée). */
  grossAmount: number;
  /** Montant HT dérivé, arrondi à 2 décimales. */
  netAmount: number;
  /** Montant de TVA, tel que netAmount + taxAmount === grossAmount. */
  taxAmount: number;
  /** Taux appliqué (en %), figé pour traçabilité. */
  ratePercent: number;
};

export class TaxComputationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaxComputationError";
  }
}

const CENTS_FACTOR = 100;

/** Arrondi demi-supérieur à 2 décimales, stable en arithmétique flottante. */
function roundHalfUpToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * CENTS_FACTOR) / CENTS_FACTOR;
}

function assertValidGross(grossAmount: number): void {
  if (!Number.isFinite(grossAmount) || grossAmount < 0) {
    throw new TaxComputationError("Le montant TTC doit être un nombre positif ou nul.");
  }
}

function assertValidRate(ratePercent: number): void {
  if (!Number.isFinite(ratePercent) || ratePercent < 0 || ratePercent > 100) {
    throw new TaxComputationError("Le taux de TVA doit être compris entre 0 et 100.");
  }
}

/**
 * Ventile un montant TTC de ligne en HT + TVA pour un taux donné.
 * Taux 0 (territoire exonéré) : HT = TTC, TVA = 0.
 * Garantit `netAmount + taxAmount === grossAmount`.
 */
export function computeLineTaxFromGross(
  grossAmount: number,
  ratePercent: number
): LineTaxBreakdown {
  assertValidGross(grossAmount);
  assertValidRate(ratePercent);

  const gross = roundHalfUpToCents(grossAmount);

  if (ratePercent === 0) {
    return { grossAmount: gross, netAmount: gross, taxAmount: 0, ratePercent };
  }

  const netAmount = roundHalfUpToCents(gross / (1 + ratePercent / 100));
  const taxAmount = roundHalfUpToCents(gross - netAmount);

  return { grossAmount: gross, netAmount, taxAmount, ratePercent };
}

export type TaxTotals = {
  grossAmount: number;
  netAmount: number;
  taxAmount: number;
};

/** Agrège des ventilations de lignes en totaux commande (somme des lignes). */
export function sumLineTax(breakdowns: readonly LineTaxBreakdown[]): TaxTotals {
  return breakdowns.reduce<TaxTotals>(
    (totals, line) => ({
      grossAmount: roundHalfUpToCents(totals.grossAmount + line.grossAmount),
      netAmount: roundHalfUpToCents(totals.netAmount + line.netAmount),
      taxAmount: roundHalfUpToCents(totals.taxAmount + line.taxAmount),
    }),
    { grossAmount: 0, netAmount: 0, taxAmount: 0 }
  );
}
