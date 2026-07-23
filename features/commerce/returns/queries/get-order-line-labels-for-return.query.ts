import "server-only";

import { db } from "@/core/db";

export type OrderLineLabelForReturn = {
  orderLineId: string;
  productName: string;
  variantName: string | null;
};

/**
 * Récupère les libellés (nom produit / variante) des lignes d'une commande
 * donnée, pour affichage dans le formulaire de sélection de retour
 * storefront. `orderId` doit déjà avoir été validé par un appelant de
 * confiance (ex. `identifyOrderForReturn`) — cette requête ne revérifie
 * aucune appartenance store/client, elle se contente de lire les libellés
 * d'une commande déjà identifiée.
 */
export async function getOrderLineLabelsForReturn(
  orderId: string
): Promise<ReadonlyArray<OrderLineLabelForReturn>> {
  const lines = await db.orderLine.findMany({
    where: { orderId },
    select: { id: true, productName: true, variantName: true },
  });

  return lines.map((line) => ({
    orderLineId: line.id,
    productName: line.productName,
    variantName: line.variantName,
  }));
}
