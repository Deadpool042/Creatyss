import { calculateReturnableQuantities } from "@/features/commerce/returns/domain/calculate-return-quantities";
import { determineReturnEligibility } from "@/features/commerce/returns/domain/determine-return-eligibility";
import type {
  ReturnEligibilityInput,
  ReturnEligibilityResult,
} from "@/features/commerce/returns/domain/return-eligibility.types";

export type AnyLineReturnEligibilityInput = Omit<ReturnEligibilityInput, "requestedLines">;

const OUTCOME_PRIORITY: Record<ReturnEligibilityResult["outcome"], number> = {
  ELIGIBLE: 0,
  MANUAL_REVIEW: 1,
  INELIGIBLE: 2,
};

/**
 * Détermine si une commande contient au moins une ligne potentiellement
 * retournable pour un motif donné, sans qualifier une demande précise.
 *
 * Ne signifie jamais que la commande entière est retournable : agrège des
 * résultats produits ligne par ligne par `determineReturnEligibility`
 * (quantité restante de chaque ligne, cf. `calculateReturnableQuantities`),
 * sans dupliquer les règles de statut, de motif, de période ou de quantité
 * déjà portées par ces deux fonctions.
 *
 * Fonction pure : aucun accès base de données, aucune mutation.
 */
export function determineAnyLineReturnEligibility(
  input: AnyLineReturnEligibilityInput
): ReturnEligibilityResult {
  const quantities = calculateReturnableQuantities(input.order.lines, input.existingReturnRequests);

  const candidateLines = input.order.lines
    .map((line) => ({
      orderLineId: line.orderLineId,
      remaining: quantities.remainingByLineId.get(line.orderLineId) ?? 0,
    }))
    .filter((candidate) => candidate.remaining > 0);

  if (candidateLines.length === 0) {
    return determineReturnEligibility({ ...input, requestedLines: [] });
  }

  const perLineResults = candidateLines.map((candidate) =>
    determineReturnEligibility({
      ...input,
      requestedLines: [{ orderLineId: candidate.orderLineId, quantity: candidate.remaining }],
    })
  );

  return perLineResults.reduce((best, current) =>
    OUTCOME_PRIORITY[current.outcome] < OUTCOME_PRIORITY[best.outcome] ? current : best
  );
}
