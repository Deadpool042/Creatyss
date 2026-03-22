import { z } from "zod";
import {
  PaymentRepositoryError,
  type CreatePaymentInput,
  type MarkPaymentPaidInput,
  type MarkPaymentFailedInput,
} from "../payment.types";
import {
  RefundRepositoryError,
  type CreateRefundInput,
  type MarkRefundSucceededInput,
  type MarkRefundFailedInput,
} from "../refund.types";

const idSchema = z.string().trim().min(1);
const paymentProviderSchema = z.enum(["stripe", "manual"]);
const currencySchema = z.string().trim().min(1);
const amountCentsSchema = z.number().int().positive();

const createPaymentInputSchema = z.object({
  orderId: idSchema,
  provider: paymentProviderSchema,
  method: z.string().trim().min(1),
  currency: currencySchema,
  amountCents: amountCentsSchema,
  providerPaymentId: z.string().trim().nullable().optional(),
  providerIntentId: z.string().trim().nullable().optional(),
  providerCheckoutId: z.string().trim().nullable().optional(),
  metadataJson: z.unknown().optional(),
});

const markPaymentPaidInputSchema = z.object({
  id: idSchema,
  providerPaymentId: z.string().trim().nullable().optional(),
  providerIntentId: z.string().trim().nullable().optional(),
  providerCheckoutId: z.string().trim().nullable().optional(),
  paidAt: z.date().optional(),
});

const markPaymentFailedInputSchema = z.object({
  id: idSchema,
  failureCode: z.string().trim().nullable().optional(),
  failureReason: z.string().trim().min(1),
  failedAt: z.date().optional(),
});

const createRefundInputSchema = z.object({
  orderId: idSchema,
  paymentId: idSchema.nullable().optional(),
  amountCents: amountCentsSchema,
  reason: z.string().trim().nullable().optional(),
  providerRefundId: z.string().trim().nullable().optional(),
});

const markRefundSucceededInputSchema = z.object({
  id: idSchema,
  providerRefundId: z.string().trim().nullable().optional(),
  processedAt: z.date().optional(),
});

const markRefundFailedInputSchema = z.object({
  id: idSchema,
  failureReason: z.string().trim().min(1),
});

export function parseCreatePaymentInput(input: CreatePaymentInput): CreatePaymentInput {
  const result = createPaymentInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "orderId":
        throw new PaymentRepositoryError("payment_order_not_found", "Commande invalide.");
      case "amountCents":
        throw new PaymentRepositoryError("payment_amount_invalid", "Montant de paiement invalide.");
      case "method":
        throw new PaymentRepositoryError("payment_method_invalid", "Méthode de paiement invalide.");
      default:
        throw new PaymentRepositoryError(
          "payment_method_invalid",
          "Données de paiement invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreatePaymentInput = {
    orderId: data.orderId,
    provider: data.provider,
    method: data.method,
    currency: data.currency,
    amountCents: data.amountCents,
  };

  if (data.providerPaymentId !== undefined) {
    parsed.providerPaymentId = data.providerPaymentId;
  }
  if (data.providerIntentId !== undefined) {
    parsed.providerIntentId = data.providerIntentId;
  }
  if (data.providerCheckoutId !== undefined) {
    parsed.providerCheckoutId = data.providerCheckoutId;
  }
  if (data.metadataJson !== undefined) {
    parsed.metadataJson = data.metadataJson;
  }

  return parsed;
}

export function parseMarkPaymentPaidInput(input: MarkPaymentPaidInput): MarkPaymentPaidInput {
  const result = markPaymentPaidInputSchema.safeParse(input);

  if (!result.success) {
    throw new PaymentRepositoryError("payment_not_found", "Paiement introuvable.");
  }

  const data = result.data;
  const parsed: MarkPaymentPaidInput = {
    id: data.id,
  };

  if (data.providerPaymentId !== undefined) {
    parsed.providerPaymentId = data.providerPaymentId;
  }
  if (data.providerIntentId !== undefined) {
    parsed.providerIntentId = data.providerIntentId;
  }
  if (data.providerCheckoutId !== undefined) {
    parsed.providerCheckoutId = data.providerCheckoutId;
  }
  if (data.paidAt !== undefined) {
    parsed.paidAt = data.paidAt;
  }

  return parsed;
}

export function parseMarkPaymentFailedInput(input: MarkPaymentFailedInput): MarkPaymentFailedInput {
  const result = markPaymentFailedInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "failureReason":
        throw new PaymentRepositoryError(
          "payment_failure_reason_invalid",
          "Raison d'échec de paiement invalide."
        );
      default:
        throw new PaymentRepositoryError("payment_not_found", "Paiement introuvable.");
    }
  }

  const data = result.data;
  const parsed: MarkPaymentFailedInput = {
    id: data.id,
    failureReason: data.failureReason,
  };

  if (data.failureCode !== undefined) {
    parsed.failureCode = data.failureCode;
  }
  if (data.failedAt !== undefined) {
    parsed.failedAt = data.failedAt;
  }

  return parsed;
}

export function parseCreateRefundInput(input: CreateRefundInput): CreateRefundInput {
  const result = createRefundInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "orderId":
        throw new RefundRepositoryError("refund_order_not_found", "Commande invalide.");
      case "paymentId":
        throw new RefundRepositoryError("refund_payment_invalid", "Paiement invalide.");
      case "amountCents":
        throw new RefundRepositoryError(
          "refund_amount_invalid",
          "Montant de remboursement invalide."
        );
      default:
        throw new RefundRepositoryError(
          "refund_amount_invalid",
          "Données de remboursement invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateRefundInput = {
    orderId: data.orderId,
    amountCents: data.amountCents,
  };

  if (data.paymentId !== undefined) {
    parsed.paymentId = data.paymentId;
  }
  if (data.reason !== undefined) {
    parsed.reason = data.reason;
  }
  if (data.providerRefundId !== undefined) {
    parsed.providerRefundId = data.providerRefundId;
  }

  return parsed;
}

export function parseMarkRefundSucceededInput(
  input: MarkRefundSucceededInput
): MarkRefundSucceededInput {
  const result = markRefundSucceededInputSchema.safeParse(input);

  if (!result.success) {
    throw new RefundRepositoryError("refund_not_found", "Remboursement introuvable.");
  }

  const data = result.data;
  const parsed: MarkRefundSucceededInput = {
    id: data.id,
  };

  if (data.providerRefundId !== undefined) {
    parsed.providerRefundId = data.providerRefundId;
  }
  if (data.processedAt !== undefined) {
    parsed.processedAt = data.processedAt;
  }

  return parsed;
}

export function parseMarkRefundFailedInput(input: MarkRefundFailedInput): MarkRefundFailedInput {
  const result = markRefundFailedInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "failureReason":
        throw new RefundRepositoryError(
          "refund_failure_reason_invalid",
          "Raison d'échec du remboursement invalide."
        );
      default:
        throw new RefundRepositoryError("refund_not_found", "Remboursement introuvable.");
    }
  }

  return result.data;
}
