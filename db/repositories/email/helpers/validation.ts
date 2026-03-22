import { z } from "zod";
import {
  OrderEmailRepositoryError,
  type CreateOrderEmailEventInput,
  type MarkOrderEmailEventSentInput,
  type MarkOrderEmailEventFailedInput,
} from "../order-email.types";
import {
  EmailTemplateRepositoryError,
  type CreateEmailTemplateInput,
  type UpdateEmailTemplateInput,
} from "../email-template.types";
import {
  NewsletterRepositoryError,
  type SubscribeNewsletterInput,
  type ConfirmNewsletterSubscriptionInput,
  type UnsubscribeNewsletterInput,
} from "../newsletter.types";

const idSchema = z.string().trim().min(1);
const emailSchema = z.email().trim();
const emailTemplateStatusSchema = z.enum(["draft", "active", "archived"]);
const emailTemplateTypeSchema = z.enum(["transactional", "newsletter"]);

const createOrderEmailEventInputSchema = z.object({
  orderId: idSchema,
  emailTemplateId: idSchema.nullable().optional(),
  templateKey: z.string().trim().min(1),
  recipientEmail: emailSchema,
  subject: z.string().trim().min(1),
  payloadJson: z.unknown().optional(),
  provider: z.string().trim().nullable().optional(),
});

const markOrderEmailEventSentInputSchema = z.object({
  id: idSchema,
  provider: z.string().trim().nullable().optional(),
  providerMessageId: z.string().trim().nullable().optional(),
  sentAt: z.date().optional(),
});

const markOrderEmailEventFailedInputSchema = z.object({
  id: idSchema,
  provider: z.string().trim().nullable().optional(),
  lastError: z.string().trim().min(1),
});

const createEmailTemplateInputSchema = z.object({
  key: z.string().trim().min(1),
  name: z.string().trim().min(1),
  type: emailTemplateTypeSchema,
  subjectTemplate: z.string().trim().min(1),
  bodyHtml: z.string().trim().min(1),
  bodyText: z.string().trim().nullable().optional(),
  status: emailTemplateStatusSchema.optional(),
});

const updateEmailTemplateInputSchema = z.object({
  id: idSchema,
  key: z.string().trim().min(1),
  name: z.string().trim().min(1),
  type: emailTemplateTypeSchema,
  subjectTemplate: z.string().trim().min(1),
  bodyHtml: z.string().trim().min(1),
  bodyText: z.string().trim().nullable().optional(),
  status: emailTemplateStatusSchema,
});

const subscribeNewsletterInputSchema = z.object({
  email: emailSchema,
  firstName: z.string().trim().nullable().optional(),
  lastName: z.string().trim().nullable().optional(),
  source: z.string().trim().nullable().optional(),
  confirmationToken: z.string().trim().nullable().optional(),
});

const confirmNewsletterSubscriptionInputSchema = z.object({
  email: emailSchema,
});

const unsubscribeNewsletterInputSchema = z.object({
  email: emailSchema,
});

export function parseCreateOrderEmailEventInput(
  input: CreateOrderEmailEventInput
): CreateOrderEmailEventInput {
  const result = createOrderEmailEventInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "orderId":
        throw new OrderEmailRepositoryError("order_email_order_not_found", "Commande invalide.");
      case "emailTemplateId":
        throw new OrderEmailRepositoryError(
          "order_email_template_invalid",
          "Template email invalide."
        );
      case "recipientEmail":
        throw new OrderEmailRepositoryError(
          "order_email_recipient_invalid",
          "Email destinataire invalide."
        );
      case "subject":
        throw new OrderEmailRepositoryError("order_email_subject_invalid", "Sujet email invalide.");
      default:
        throw new OrderEmailRepositoryError(
          "order_email_subject_invalid",
          "Données d'événement email invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateOrderEmailEventInput = {
    orderId: data.orderId,
    templateKey: data.templateKey,
    recipientEmail: data.recipientEmail,
    subject: data.subject,
  };

  if (data.emailTemplateId !== undefined) parsed.emailTemplateId = data.emailTemplateId;
  if (data.payloadJson !== undefined) parsed.payloadJson = data.payloadJson;
  if (data.provider !== undefined) parsed.provider = data.provider;

  return parsed;
}

export function parseMarkOrderEmailEventSentInput(
  input: MarkOrderEmailEventSentInput
): MarkOrderEmailEventSentInput {
  const result = markOrderEmailEventSentInputSchema.safeParse(input);

  if (!result.success) {
    throw new OrderEmailRepositoryError(
      "order_email_event_not_found",
      "Événement email introuvable."
    );
  }

  const data = result.data;
  const parsed: MarkOrderEmailEventSentInput = {
    id: data.id,
  };

  if (data.provider !== undefined) parsed.provider = data.provider;
  if (data.providerMessageId !== undefined) parsed.providerMessageId = data.providerMessageId;
  if (data.sentAt !== undefined) parsed.sentAt = data.sentAt;

  return parsed;
}

export function parseMarkOrderEmailEventFailedInput(
  input: MarkOrderEmailEventFailedInput
): MarkOrderEmailEventFailedInput {
  const result = markOrderEmailEventFailedInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "lastError":
        throw new OrderEmailRepositoryError(
          "order_email_last_error_invalid",
          "Erreur email invalide."
        );
      default:
        throw new OrderEmailRepositoryError(
          "order_email_event_not_found",
          "Événement email introuvable."
        );
    }
  }

  const data = result.data;
  const parsed: MarkOrderEmailEventFailedInput = {
    id: data.id,
    lastError: data.lastError,
  };

  if (data.provider !== undefined) parsed.provider = data.provider;

  return parsed;
}

export function parseCreateEmailTemplateInput(
  input: CreateEmailTemplateInput
): CreateEmailTemplateInput {
  const result = createEmailTemplateInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "key":
        throw new EmailTemplateRepositoryError(
          "email_template_key_invalid",
          "Clé de template invalide."
        );
      case "name":
        throw new EmailTemplateRepositoryError(
          "email_template_name_invalid",
          "Nom de template invalide."
        );
      case "subjectTemplate":
        throw new EmailTemplateRepositoryError(
          "email_template_subject_invalid",
          "Sujet de template invalide."
        );
      case "bodyHtml":
        throw new EmailTemplateRepositoryError(
          "email_template_body_invalid",
          "Corps HTML de template invalide."
        );
      default:
        throw new EmailTemplateRepositoryError(
          "email_template_body_invalid",
          "Données de template invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateEmailTemplateInput = {
    key: data.key,
    name: data.name,
    type: data.type,
    subjectTemplate: data.subjectTemplate,
    bodyHtml: data.bodyHtml,
  };

  if (data.bodyText !== undefined) parsed.bodyText = data.bodyText;
  if (data.status !== undefined) parsed.status = data.status;

  return parsed;
}

export function parseUpdateEmailTemplateInput(
  input: UpdateEmailTemplateInput
): UpdateEmailTemplateInput {
  const result = updateEmailTemplateInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];
    switch (issue?.path[0]) {
      case "id":
        throw new EmailTemplateRepositoryError("email_template_not_found", "Template introuvable.");
      case "key":
        throw new EmailTemplateRepositoryError(
          "email_template_key_invalid",
          "Clé de template invalide."
        );
      case "name":
        throw new EmailTemplateRepositoryError(
          "email_template_name_invalid",
          "Nom de template invalide."
        );
      case "subjectTemplate":
        throw new EmailTemplateRepositoryError(
          "email_template_subject_invalid",
          "Sujet de template invalide."
        );
      case "bodyHtml":
        throw new EmailTemplateRepositoryError(
          "email_template_body_invalid",
          "Corps HTML de template invalide."
        );
      default:
        throw new EmailTemplateRepositoryError(
          "email_template_body_invalid",
          "Données de template invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpdateEmailTemplateInput = {
    id: data.id,
    key: data.key,
    name: data.name,
    type: data.type,
    subjectTemplate: data.subjectTemplate,
    bodyHtml: data.bodyHtml,
    status: data.status,
  };

  if (data.bodyText !== undefined) parsed.bodyText = data.bodyText;

  return parsed;
}

export function parseSubscribeNewsletterInput(
  input: SubscribeNewsletterInput
): SubscribeNewsletterInput {
  const result = subscribeNewsletterInputSchema.safeParse(input);

  if (!result.success) {
    throw new NewsletterRepositoryError("newsletter_email_invalid", "Email newsletter invalide.");
  }

  const data = result.data;
  const parsed: SubscribeNewsletterInput = {
    email: data.email,
  };

  if (data.firstName !== undefined) parsed.firstName = data.firstName;
  if (data.lastName !== undefined) parsed.lastName = data.lastName;
  if (data.source !== undefined) parsed.source = data.source;
  if (data.confirmationToken !== undefined) {
    parsed.confirmationToken = data.confirmationToken;
  }

  return parsed;
}

export function parseConfirmNewsletterSubscriptionInput(
  input: ConfirmNewsletterSubscriptionInput
): ConfirmNewsletterSubscriptionInput {
  const result = confirmNewsletterSubscriptionInputSchema.safeParse(input);

  if (!result.success) {
    throw new NewsletterRepositoryError("newsletter_email_invalid", "Email newsletter invalide.");
  }

  return result.data;
}

export function parseUnsubscribeNewsletterInput(
  input: UnsubscribeNewsletterInput
): UnsubscribeNewsletterInput {
  const result = unsubscribeNewsletterInputSchema.safeParse(input);

  if (!result.success) {
    throw new NewsletterRepositoryError("newsletter_email_invalid", "Email newsletter invalide.");
  }

  return result.data;
}
