import { z } from "zod";
import { EmailMessageRepositoryError } from "@db-email/messages";
import type {
  CreateEmailMessageInput,
  FailEmailMessageInput,
} from "@db-email/messages/types/message.types";

export function normalizeEmailAddress(email: string): string {
  const result = z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase())
    .safeParse(email);

  if (!result.success) {
    throw new EmailMessageRepositoryError("email_to_invalid", "Adresse email invalide.");
  }

  return result.data;
}

const emailCategorySchema = z.enum([
  "transactional",
  "support",
  "newsletter",
  "marketing",
  "generic",
]);
const emailRecipientKindSchema = z.enum(["user", "customer", "external"]);
const nonEmptyStringSchema = z.string().trim().min(1);
const normalizedEmailSchema = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());
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
const createEmailMessageInputSchema = z
  .object({
    storeId: nonEmptyStringSchema,
    category: emailCategorySchema,
    recipientKind: emailRecipientKindSchema,
    toEmail: normalizedEmailSchema,
    toName: optionalNullableTrimmedStringSchema,
    subject: nonEmptyStringSchema,
    htmlBody: optionalNullableTrimmedStringSchema,
    textBody: optionalNullableTrimmedStringSchema,
    userId: optionalNullableTrimmedStringSchema,
    customerId: optionalNullableTrimmedStringSchema,
    templateDefinitionId: optionalNullableTrimmedStringSchema,
    templateVariantId: optionalNullableTrimmedStringSchema,
    notificationId: optionalNullableTrimmedStringSchema,
    orderId: optionalNullableTrimmedStringSchema,
    eventId: optionalNullableTrimmedStringSchema,
    supportTicketId: optionalNullableTrimmedStringSchema,
  })
  .superRefine((data, ctx) => {
    if (data.recipientKind === "user" && !data.userId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["userId"],
        message: "user_required",
      });
    }

    if (data.recipientKind === "customer" && !data.customerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customerId"],
        message: "customer_required",
      });
    }
  });
const failEmailMessageInputSchema = z.object({
  failureCode: optionalNullableTrimmedStringSchema,
  failureMessage: nonEmptyStringSchema,
});

export function parseCreateEmailMessageInput(
  input: CreateEmailMessageInput
): CreateEmailMessageInput {
  const result = createEmailMessageInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storeId":
        throw new EmailMessageRepositoryError("email_store_invalid", "Boutique email invalide.");
      case "category":
        throw new EmailMessageRepositoryError(
          "email_category_invalid",
          "Catégorie email invalide."
        );
      case "recipientKind":
        throw new EmailMessageRepositoryError(
          "email_recipient_kind_invalid",
          "Type de destinataire email invalide."
        );
      case "toEmail":
        throw new EmailMessageRepositoryError("email_to_invalid", "Adresse email invalide.");
      case "subject":
        throw new EmailMessageRepositoryError("email_subject_invalid", "Sujet email invalide.");
      case "userId":
        throw new EmailMessageRepositoryError(
          "email_user_missing",
          "Un email destinataire utilisateur doit référencer un utilisateur."
        );
      case "customerId":
        throw new EmailMessageRepositoryError(
          "email_customer_missing",
          "Un email destinataire client doit référencer un client."
        );
      default:
        throw new EmailMessageRepositoryError(
          "email_subject_invalid",
          "Les données de l'email sont invalides."
        );
    }
  }

  return {
    storeId: result.data.storeId,
    category: result.data.category,
    recipientKind: result.data.recipientKind,
    toEmail: result.data.toEmail,
    toName: result.data.toName ?? null,
    subject: result.data.subject,
    htmlBody: result.data.htmlBody ?? null,
    textBody: result.data.textBody ?? null,
    userId: result.data.userId ?? null,
    customerId: result.data.customerId ?? null,
    templateDefinitionId: result.data.templateDefinitionId ?? null,
    templateVariantId: result.data.templateVariantId ?? null,
    notificationId: result.data.notificationId ?? null,
    orderId: result.data.orderId ?? null,
    eventId: result.data.eventId ?? null,
    supportTicketId: result.data.supportTicketId ?? null,
  };
}

export function parseFailEmailMessageInput(
  input: FailEmailMessageInput
): FailEmailMessageInput {
  const result = failEmailMessageInputSchema.safeParse(input);

  if (!result.success) {
    throw new EmailMessageRepositoryError(
      "email_failure_message_invalid",
      "Message d'échec email invalide."
    );
  }

  return {
    failureCode: result.data.failureCode ?? null,
    failureMessage: result.data.failureMessage,
  };
}
