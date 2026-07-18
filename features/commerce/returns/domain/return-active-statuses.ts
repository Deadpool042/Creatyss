import type { ReturnRequestStatus } from "@/prisma-generated/client";

/**
 * Statuts considérés comme "demande de retour active" pour une commande.
 *
 * Règle métier : une commande ne peut porter qu'une seule demande de retour
 * active à la fois (cf. `createReturnRequest`). Cette liste est la source
 * unique de vérité pour cette règle — ne pas la redéfinir localement.
 *
 * Ne pas confondre avec d'autres listes de statuts "non terminaux" utilisées
 * ailleurs pour des besoins d'affichage différents (ex. dernière demande à
 * afficher côté admin), qui peuvent légitimement inclure des statuts
 * supplémentaires (CLOSED, REJECTED) sans porter la même sémantique.
 */
export const ACTIVE_RETURN_REQUEST_STATUSES = [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "RECEIVED",
  "REFUNDED",
] as const satisfies readonly ReturnRequestStatus[];

export type ActiveReturnRequestStatus = (typeof ACTIVE_RETURN_REQUEST_STATUSES)[number];

export function isActiveReturnRequestStatus(status: ReturnRequestStatus): boolean {
  return (ACTIVE_RETURN_REQUEST_STATUSES as readonly ReturnRequestStatus[]).includes(status);
}
