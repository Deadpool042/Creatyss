import "server-only";

import { db } from "@/core/db";
import { withTransaction } from "@/core/db/transactions/with-transaction";
import { stripe } from "@/core/payments/stripe/server";

export class ProcessStripeRefundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessStripeRefundError";
  }
}

type ProcessStripeRefundInput = {
  orderId: string;
  storeId: string;
  returnRequestId: string;
};

/**
 * Déclenche un remboursement Stripe pour un retour validé.
 * Pattern Stripe-first : Stripe est appelé avant la mise à jour DB.
 * Si Stripe échoue, le statut retour reste RECEIVED et peut être retenté.
 * Si la DB échoue après Stripe, un log d'alerte permet une réconciliation manuelle.
 *
 * Montant remboursé = somme des parts de lineTotalAmount par ligne retournée.
 * Les lignes sans orderLineId (retours manuels) sont ignorées dans le calcul.
 */
export async function processStripeRefund(input: ProcessStripeRefundInput): Promise<void> {
  const payment = await db.payment.findFirst({
    where: { orderId: input.orderId, storeId: input.storeId, status: "CAPTURED" },
    select: {
      id: true,
      providerPaymentId: true,
      amountCaptured: true,
      amountRefunded: true,
      currencyCode: true,
    },
  });

  if (payment === null) {
    throw new ProcessStripeRefundError("Aucun paiement capturé pour cette commande.");
  }

  if (payment.providerPaymentId === null) {
    throw new ProcessStripeRefundError("Référence Stripe (PaymentIntent) absente sur le paiement.");
  }

  const returnItems = await db.returnItem.findMany({
    where: { returnRequestId: input.returnRequestId },
    select: {
      quantity: true,
      orderLine: { select: { quantity: true, lineTotalAmount: true } },
    },
  });

  let refundAmountDecimal = 0;
  for (const item of returnItems) {
    if (item.orderLine === null) continue;
    const share = item.quantity / item.orderLine.quantity;
    refundAmountDecimal += share * Number(item.orderLine.lineTotalAmount);
  }

  const remaining = Number(payment.amountCaptured ?? 0) - Number(payment.amountRefunded);
  const refundAmount =
    refundAmountDecimal > 0 ? Math.min(refundAmountDecimal, remaining) : remaining;
  const refundCents = Math.round(refundAmount * 100);

  if (refundCents <= 0) {
    throw new ProcessStripeRefundError("Montant de remboursement invalide ou déjà remboursé.");
  }

  // Stripe-first : tout échec ici laisse la DB inchangée.
  const stripeRefund = await stripe.refunds.create({
    payment_intent: payment.providerPaymentId,
    amount: refundCents,
  });

  // DB update : erreur ici = incohérence Stripe/DB → log d'alerte pour réconciliation.
  try {
    await withTransaction(async (tx) => {
      await tx.paymentRefund.create({
        data: {
          paymentId: payment.id,
          amount: refundCents / 100,
          currencyCode: payment.currencyCode,
          provider: "stripe",
          providerReference: stripeRefund.id,
          refundedAt: new Date(),
        },
      });

      const newRefunded = Number(payment.amountRefunded) + refundCents / 100;
      const newStatus =
        newRefunded >= Number(payment.amountCaptured ?? 0) ? "REFUNDED" : "PARTIALLY_REFUNDED";

      await tx.payment.update({
        where: { id: payment.id },
        data: { amountRefunded: newRefunded, status: newStatus },
      });
    });
  } catch (dbError) {
    console.error(
      `[processStripeRefund] Stripe refund ${stripeRefund.id} créé mais DB non mise à jour. Réconciliation manuelle requise.`,
      dbError
    );
    throw new ProcessStripeRefundError(
      "Remboursement Stripe effectué mais enregistrement DB échoué. Contactez le support."
    );
  }
}
