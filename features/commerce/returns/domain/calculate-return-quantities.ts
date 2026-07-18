import type {
  ReturnEligibilityExistingRequest,
  ReturnEligibilityOrderLine,
} from "@/features/commerce/returns/domain/return-eligibility.types";

/**
 * Statuts de demande de retour dont les articles ne doivent pas être
 * comptés comme quantité déjà consommée (une demande annulée ou refusée ne
 * "mange" pas de quantité disponible).
 */
const NON_CONSUMING_STATUSES = ["CANCELLED", "REJECTED"] as const;

export type CalculateReturnableQuantitiesResult =
  | { status: "OK"; remainingByLineId: ReadonlyMap<string, number> }
  /**
   * Au moins un article de retour existant n'est plus rattaché à une ligne
   * de commande (`orderLineId: null`), et sa quantité ne peut être imputée à
   * aucune ligne précise : `ReturnItem` ne porte aucun identifiant stable de
   * ligne hors la relation elle-même — `sku`/`productName`/`variantName`
   * sont des snapshots texte libre, ni uniques par commande ni garantis
   * stables, donc impropres à une réattribution fiable. En l'absence de
   * donnée permettant de circonscrire l'incertitude à un sous-ensemble de
   * lignes, `uncertainLineIds` couvre toutes les lignes de la commande (la
   * quantité orpheline peut en théorie provenir de n'importe laquelle).
   * `remainingByLineId` reste calculé pour information mais ne doit pas être
   * présenté comme exact pour les lignes listées dans `uncertainLineIds`.
   */
  | {
      status: "UNCERTAIN";
      remainingByLineId: ReadonlyMap<string, number>;
      uncertainLineIds: ReadonlySet<string>;
    };

/**
 * Fonction pure. Calcule, pour chaque ligne de commande, la quantité encore
 * disponible pour un retour, en retranchant la quantité déjà consommée par
 * des demandes de retour existantes non annulées/refusées.
 *
 * Un article avec un `orderLineId` connu n'affecte que cette ligne. Un
 * article orphelin (`orderLineId: null`) ne peut être imputé à aucune ligne
 * précise avec les données actuellement persistées ; le résultat reste
 * structuré (jamais un simple indicateur opaque) pour que l'appelant sache
 * exactement quelles lignes sont concernées et quelles quantités restent
 * calculables.
 */
export function calculateReturnableQuantities(
  orderLines: ReadonlyArray<ReturnEligibilityOrderLine>,
  existingReturnRequests: ReadonlyArray<ReturnEligibilityExistingRequest>
): CalculateReturnableQuantitiesResult {
  const consumingRequests = existingReturnRequests.filter(
    (request) => !(NON_CONSUMING_STATUSES as readonly string[]).includes(request.status)
  );

  const consumedByLineId = new Map<string, number>();
  let hasOrphanItem = false;

  for (const request of consumingRequests) {
    for (const item of request.items) {
      if (item.orderLineId === null) {
        hasOrphanItem = true;
        continue;
      }
      consumedByLineId.set(
        item.orderLineId,
        (consumedByLineId.get(item.orderLineId) ?? 0) + item.quantity
      );
    }
  }

  const remainingByLineId = new Map<string, number>();
  for (const line of orderLines) {
    const consumed = consumedByLineId.get(line.orderLineId) ?? 0;
    remainingByLineId.set(line.orderLineId, line.quantity - consumed);
  }

  if (hasOrphanItem) {
    // Aucune donnée persistée ne permet de circonscrire l'incertitude à un
    // sous-ensemble de lignes plausible : toute ligne de la commande peut en
    // théorie être la ligne d'origine de l'article orphelin.
    return {
      status: "UNCERTAIN",
      remainingByLineId,
      uncertainLineIds: new Set(orderLines.map((line) => line.orderLineId)),
    };
  }

  return { status: "OK", remainingByLineId };
}
