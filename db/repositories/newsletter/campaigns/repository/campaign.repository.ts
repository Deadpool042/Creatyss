import { prisma } from "@/db/prisma-client";
import {
  mapNewsletterCampaign,
  mapNewsletterCampaignStatusToPrisma,
} from "@db-newsletter/helpers/mappers";
import {
  parseCreateNewsletterCampaignInput,
  parseUpdateNewsletterCampaignInput,
} from "@db-newsletter/helpers/validation";
import {
  findNewsletterCampaignRowById,
  listNewsletterCampaignRowsByListId,
} from "@db-newsletter/queries/newsletter.queries";
import type {
  CreateNewsletterCampaignInput,
  NewsletterCampaignDetail,
  NewsletterCampaignStatus,
  NewsletterCampaignSummary,
  UpdateNewsletterCampaignInput,
} from "@db-newsletter/campaigns/types/campaign.types";

export async function listNewsletterCampaigns(
  listId: string
): Promise<NewsletterCampaignSummary[]> {
  const rows = await listNewsletterCampaignRowsByListId(listId.trim());
  return rows.map(mapNewsletterCampaign);
}

export async function findNewsletterCampaignById(
  id: string
): Promise<NewsletterCampaignDetail | null> {
  const row = await findNewsletterCampaignRowById(id.trim());
  return row ? mapNewsletterCampaign(row) : null;
}

export async function createNewsletterCampaign(
  input: CreateNewsletterCampaignInput
): Promise<NewsletterCampaignDetail> {
  const parsedInput = parseCreateNewsletterCampaignInput(input);

  const created = await prisma.newsletterCampaign.create({
    data: {
      listId: parsedInput.listId,
      name: parsedInput.name,
      subject: parsedInput.subject,
      previewText: parsedInput.previewText ?? null,
      status: mapNewsletterCampaignStatusToPrisma(parsedInput.status),
      scheduledAt: parsedInput.scheduledAt ?? null,
    },
    select: {
      id: true,
    },
  });

  const row = await findNewsletterCampaignRowById(created.id);

  if (!row) {
    throw new Error("Newsletter campaign not found after create.");
  }

  return mapNewsletterCampaign(row);
}

export async function updateNewsletterCampaign(
  input: UpdateNewsletterCampaignInput
): Promise<NewsletterCampaignDetail | null> {
  const parsedInput = parseUpdateNewsletterCampaignInput(input);
  const data: {
    name?: string;
    subject?: string;
    previewText?: string | null;
    status?: "DRAFT" | "SCHEDULED" | "SENDING" | "SENT" | "CANCELLED";
    scheduledAt?: Date | null;
  } = {};

  if (parsedInput.name !== undefined) {
    data.name = parsedInput.name;
  }

  if (parsedInput.subject !== undefined) {
    data.subject = parsedInput.subject;
  }

  if (parsedInput.previewText !== undefined) {
    data.previewText = parsedInput.previewText;
  }

  if (parsedInput.status !== undefined) {
    data.status = mapNewsletterCampaignStatusToPrisma(parsedInput.status);
  }

  if (parsedInput.scheduledAt !== undefined) {
    data.scheduledAt = parsedInput.scheduledAt;
  }

  const updated = await prisma.newsletterCampaign.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findNewsletterCampaignRowById(parsedInput.id);
  return row ? mapNewsletterCampaign(row) : null;
}

export async function setNewsletterCampaignStatus(
  id: string,
  status: NewsletterCampaignStatus
): Promise<NewsletterCampaignDetail | null> {
  return updateNewsletterCampaign({ id, status });
}
