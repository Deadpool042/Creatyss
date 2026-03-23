import { z } from "zod";
import { NewsletterRepositoryError } from "@db-newsletter/subscribers";
import type {
  ConfirmNewsletterSubscriptionInput,
  SubscribeNewsletterInput,
  UnsubscribeNewsletterInput,
} from "@db-newsletter/subscribers/types/subscription.types";
import type {
  CreateNewsletterCampaignInput,
  UpdateNewsletterCampaignInput,
} from "@db-newsletter/campaigns/types/campaign.types";

export function normalizeNewsletterEmail(email: string): string {
  const result = z
    .email()
    .trim()
    .transform((value) => value.toLowerCase())
    .safeParse(email);

  if (!result.success) {
    throw new NewsletterRepositoryError(
      "newsletter_email_invalid",
      "Adresse email newsletter invalide."
    );
  }

  return result.data;
}

const newsletterCampaignStatusSchema = z.enum([
  "draft",
  "scheduled",
  "sending",
  "sent",
  "cancelled",
]);
const nonEmptyStringSchema = z.string().trim().min(1);
const normalizedEmailSchema = z
  .email()
  .trim()
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
const subscribeNewsletterInputSchema = z.object({
  listId: nonEmptyStringSchema,
  email: normalizedEmailSchema,
  customerId: optionalNullableTrimmedStringSchema,
  firstName: optionalNullableTrimmedStringSchema,
  lastName: optionalNullableTrimmedStringSchema,
});
const confirmNewsletterSubscriptionInputSchema = z.object({
  listId: nonEmptyStringSchema,
  email: normalizedEmailSchema,
});
const unsubscribeNewsletterInputSchema = z.object({
  listId: nonEmptyStringSchema,
  email: normalizedEmailSchema,
});
const createNewsletterCampaignInputSchema = z.object({
  listId: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  subject: nonEmptyStringSchema,
  previewText: optionalNullableTrimmedStringSchema,
  status: newsletterCampaignStatusSchema.optional(),
  scheduledAt: z.date().nullable().optional(),
});
const updateNewsletterCampaignInputSchema = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema.optional(),
  subject: nonEmptyStringSchema.optional(),
  previewText: optionalNullableTrimmedStringSchema,
  status: newsletterCampaignStatusSchema.optional(),
  scheduledAt: z.date().nullable().optional(),
});
type ParsedCreateNewsletterCampaignInput = {
  listId: string;
  name: string;
  subject: string;
  previewText: string | null;
  status: NonNullable<CreateNewsletterCampaignInput["status"]>;
  scheduledAt: Date | null;
};
type ParsedUpdateNewsletterCampaignInput = {
  id: string;
  name?: string;
  subject?: string;
  previewText?: string | null;
  status?: UpdateNewsletterCampaignInput["status"];
  scheduledAt?: Date | null;
};

export function parseSubscribeNewsletterInput(
  input: SubscribeNewsletterInput
): SubscribeNewsletterInput {
  const result = subscribeNewsletterInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "listId":
        throw new NewsletterRepositoryError(
          "newsletter_list_invalid",
          "Liste newsletter invalide."
        );
      case "email":
        throw new NewsletterRepositoryError(
          "newsletter_email_invalid",
          "Adresse email newsletter invalide."
        );
      default:
        throw new NewsletterRepositoryError(
          "newsletter_email_invalid",
          "Les données d'inscription newsletter sont invalides."
        );
    }
  }

  return {
    listId: result.data.listId,
    email: result.data.email,
    customerId: result.data.customerId ?? null,
    firstName: result.data.firstName ?? null,
    lastName: result.data.lastName ?? null,
  };
}

export function parseConfirmNewsletterSubscriptionInput(
  input: ConfirmNewsletterSubscriptionInput
): ConfirmNewsletterSubscriptionInput {
  const result = confirmNewsletterSubscriptionInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "listId":
        throw new NewsletterRepositoryError(
          "newsletter_list_invalid",
          "Liste newsletter invalide."
        );
      case "email":
        throw new NewsletterRepositoryError(
          "newsletter_email_invalid",
          "Adresse email newsletter invalide."
        );
      default:
        throw new NewsletterRepositoryError(
          "newsletter_email_invalid",
          "Les données newsletter sont invalides."
        );
    }
  }

  return result.data;
}

export function parseUnsubscribeNewsletterInput(
  input: UnsubscribeNewsletterInput
): UnsubscribeNewsletterInput {
  const result = unsubscribeNewsletterInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "listId":
        throw new NewsletterRepositoryError(
          "newsletter_list_invalid",
          "Liste newsletter invalide."
        );
      case "email":
        throw new NewsletterRepositoryError(
          "newsletter_email_invalid",
          "Adresse email newsletter invalide."
        );
      default:
        throw new NewsletterRepositoryError(
          "newsletter_email_invalid",
          "Les données newsletter sont invalides."
        );
    }
  }

  return result.data;
}

export function parseCreateNewsletterCampaignInput(
  input: CreateNewsletterCampaignInput
): ParsedCreateNewsletterCampaignInput {
  const result = createNewsletterCampaignInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "listId":
        throw new NewsletterRepositoryError(
          "newsletter_list_invalid",
          "Liste newsletter invalide."
        );
      case "name":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_name_invalid",
          "Nom de campagne invalide."
        );
      case "subject":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_subject_invalid",
          "Sujet de campagne invalide."
        );
      case "status":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_status_invalid",
          "Statut de campagne invalide."
        );
      case "scheduledAt":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_schedule_invalid",
          "Planification de campagne invalide."
        );
      default:
        throw new NewsletterRepositoryError(
          "newsletter_campaign_name_invalid",
          "Les données de campagne sont invalides."
        );
    }
  }

  return {
    listId: result.data.listId,
    name: result.data.name,
    subject: result.data.subject,
    previewText: result.data.previewText ?? null,
    status: result.data.status ?? "draft",
    scheduledAt: result.data.scheduledAt ?? null,
  };
}

export function parseUpdateNewsletterCampaignInput(
  input: UpdateNewsletterCampaignInput
): ParsedUpdateNewsletterCampaignInput {
  const result = updateNewsletterCampaignInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new NewsletterRepositoryError("newsletter_campaign_id_invalid", "Campagne invalide.");
      case "name":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_name_invalid",
          "Nom de campagne invalide."
        );
      case "subject":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_subject_invalid",
          "Sujet de campagne invalide."
        );
      case "status":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_status_invalid",
          "Statut de campagne invalide."
        );
      case "scheduledAt":
        throw new NewsletterRepositoryError(
          "newsletter_campaign_schedule_invalid",
          "Planification de campagne invalide."
        );
      default:
        throw new NewsletterRepositoryError(
          "newsletter_campaign_name_invalid",
          "Les données de campagne sont invalides."
        );
    }
  }

  const parsedInput: ParsedUpdateNewsletterCampaignInput = {
    id: result.data.id,
  };

  if (result.data.name !== undefined) {
    parsedInput.name = result.data.name;
  }

  if (result.data.subject !== undefined) {
    parsedInput.subject = result.data.subject;
  }

  if (result.data.previewText !== undefined) {
    parsedInput.previewText = result.data.previewText;
  }

  if (result.data.status !== undefined) {
    parsedInput.status = result.data.status;
  }

  if (result.data.scheduledAt !== undefined) {
    parsedInput.scheduledAt = result.data.scheduledAt;
  }

  return parsedInput;
}
