import { z } from "zod";
import { PaymentRepositoryError } from "@db-payments/core";
import type {
  CreatePaymentInput,
  FailPaymentInput,
  ProviderPaymentRefsInput,
} from "@db-payments/core/types/payment.types";

const paymentMethodKindSchema = z.enum(["card", "bank_transfer", "gift_card", "other"]);
const nonEmptyStringSchema = z.string().trim().min(1);
const amountSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => /^\d+(?:\.\d+)?$/.test(value), {
    message: "invalid_amount",
  });
const currencyCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase())
  .refine((value) => /^[A-Z]{3}$/.test(value), {
    message: "invalid_currency",
  });
const optionalNullableTrimmedStringSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value || null;
  });
const createPaymentInputSchema = z.object({
  orderId: nonEmptyStringSchema,
  methodKind: paymentMethodKindSchema,
  amount: amountSchema,
  currencyCode: currencyCodeSchema,
  providerName: optionalNullableTrimmedStringSchema,
  providerReference: optionalNullableTrimmedStringSchema,
  providerPaymentIntentRef: optionalNullableTrimmedStringSchema,
});
const providerPaymentRefsInputSchema = z.object({
  providerName: optionalNullableTrimmedStringSchema,
  providerReference: optionalNullableTrimmedStringSchema,
  providerPaymentIntentRef: optionalNullableTrimmedStringSchema,
});
const failPaymentInputSchema = providerPaymentRefsInputSchema.extend({
  failureCode: optionalNullableTrimmedStringSchema,
  failureMessage: nonEmptyStringSchema,
});
type ParsedProviderPaymentRefsInput = {
  providerName?: string | null;
  providerReference?: string | null;
  providerPaymentIntentRef?: string | null;
};
type ParsedCreatePaymentInput = {
  orderId: string;
  methodKind: CreatePaymentInput["methodKind"];
  amount: string;
  currencyCode: string;
  providerName?: string | null;
  providerReference?: string | null;
  providerPaymentIntentRef?: string | null;
};
type ParsedFailPaymentInput = ParsedProviderPaymentRefsInput & {
  failureCode: string | null;
  failureMessage: string;
};

export function parseCreatePaymentInput(input: CreatePaymentInput): ParsedCreatePaymentInput {
  const result = createPaymentInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "orderId":
        throw new PaymentRepositoryError(
          "payment_order_invalid",
          "Commande de paiement invalide."
        );
      case "amount":
        throw new PaymentRepositoryError(
          "payment_amount_invalid",
          "Montant de paiement invalide."
        );
      case "currencyCode":
        throw new PaymentRepositoryError(
          "payment_currency_invalid",
          "Devise de paiement invalide."
        );
      case "methodKind":
        throw new PaymentRepositoryError(
          "payment_method_invalid",
          "Mode de paiement invalide."
        );
      default:
        throw new PaymentRepositoryError(
          "payment_order_invalid",
          "Les données de paiement sont invalides."
        );
    }
  }

  const parsedInput: ParsedCreatePaymentInput = {
    orderId: result.data.orderId,
    methodKind: result.data.methodKind,
    amount: result.data.amount,
    currencyCode: result.data.currencyCode,
  };

  if (result.data.providerName !== undefined) {
    parsedInput.providerName = result.data.providerName;
  }

  if (result.data.providerReference !== undefined) {
    parsedInput.providerReference = result.data.providerReference;
  }

  if (result.data.providerPaymentIntentRef !== undefined) {
    parsedInput.providerPaymentIntentRef = result.data.providerPaymentIntentRef;
  }

  return parsedInput;
}

export function parseProviderPaymentRefsInput(
  input: ProviderPaymentRefsInput
): ParsedProviderPaymentRefsInput {
  const result = providerPaymentRefsInputSchema.safeParse(input);

  if (!result.success) {
    throw new PaymentRepositoryError(
      "payment_provider_reference_invalid",
      "Références fournisseur de paiement invalides."
    );
  }

  const parsedInput: ParsedProviderPaymentRefsInput = {};

  if (result.data.providerName !== undefined) {
    parsedInput.providerName = result.data.providerName;
  }

  if (result.data.providerReference !== undefined) {
    parsedInput.providerReference = result.data.providerReference;
  }

  if (result.data.providerPaymentIntentRef !== undefined) {
    parsedInput.providerPaymentIntentRef = result.data.providerPaymentIntentRef;
  }

  return parsedInput;
}

export function parseFailPaymentInput(input: FailPaymentInput): ParsedFailPaymentInput {
  const result = failPaymentInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "failureMessage":
        throw new PaymentRepositoryError(
          "payment_failure_message_invalid",
          "Message d'échec paiement invalide."
        );
      default:
        throw new PaymentRepositoryError(
          "payment_failure_message_invalid",
          "Les données d'échec paiement sont invalides."
        );
    }
  }

  const refs = parseProviderPaymentRefsInput({
    ...(result.data.providerName !== undefined
      ? { providerName: result.data.providerName }
      : {}),
    ...(result.data.providerReference !== undefined
      ? { providerReference: result.data.providerReference }
      : {}),
    ...(result.data.providerPaymentIntentRef !== undefined
      ? { providerPaymentIntentRef: result.data.providerPaymentIntentRef }
      : {}),
  });

  return {
    ...refs,
    failureCode: result.data.failureCode ?? null,
    failureMessage: result.data.failureMessage,
  };
}
