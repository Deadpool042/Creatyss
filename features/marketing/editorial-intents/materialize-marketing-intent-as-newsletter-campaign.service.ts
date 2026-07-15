"use server";

import "server-only";

import {
  Prisma,
  type MarketingIntent,
  type MarketingIntentStatus,
  type NewsletterCampaign,
} from "@/prisma-generated/client";
import { db } from "@/core/db";

const NEWSLETTER_CHANNEL = "NEWSLETTER" as const;

const DEFAULT_CAMPAIGN_NAME = "Communication newsletter";
const CAMPAIGN_BODY_MAX_LENGTH = 500_000;

export type MaterializeMarketingIntentAsNewsletterCampaignInput = Readonly<{
  intentId: string;
}>;

export type MaterializeMarketingIntentAsNewsletterCampaignResult =
  | Readonly<{
      status: "created";
      newsletterCampaign: NewsletterCampaign;
    }>
  | Readonly<{
      status: "already_materialized";
      newsletterCampaign: NewsletterCampaign;
    }>
  | Readonly<{
      status: "not_found";
      newsletterCampaign: null;
    }>
  | Readonly<{
      status: "invalid_status";
      newsletterCampaign: null;
      currentStatus: MarketingIntentStatus;
    }>
  | Readonly<{
      status: "channel_not_suggested";
      newsletterCampaign: null;
    }>;

function isUniqueConstraintError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2002";
  }

  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

function asJsonObject(value: Prisma.JsonValue | null): Prisma.JsonObject | null {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    return null;
  }

  return value as Prisma.JsonObject;
}

function readContextString(value: Prisma.JsonValue | null, key: string): string | null {
  const objectValue = asJsonObject(value);

  if (objectValue === null) {
    return null;
  }

  const item = objectValue[key];
  const trimmed = typeof item === "string" ? item.trim() : "";
  return trimmed.length > 0 ? trimmed : null;
}

export function buildMaterializedNewsletterCampaignCode(intentId: string): string {
  return `mi-${intentId}`;
}

function getCampaignTitle(intent: MarketingIntent): string {
  return readContextString(intent.contextJson, "title") ?? intent.subjectId;
}

function getSourceLink(intent: MarketingIntent): string | null {
  if (intent.subjectType !== "BLOG_POST") {
    return null;
  }

  const slug = readContextString(intent.contextJson, "slug");
  return slug !== null ? `/blog/${slug}` : null;
}

function buildBodyHtml(title: string, link: string | null): string {
  const linkHtml = link !== null ? `<p><a href="${link}">Lire l'article</a></p>` : "";
  return `<p>${title}</p>${linkHtml}`.slice(0, CAMPAIGN_BODY_MAX_LENGTH);
}

function buildBodyText(title: string, link: string | null): string {
  const linkText = link !== null ? `\n${link}` : "";
  return `${title}${linkText}`.slice(0, CAMPAIGN_BODY_MAX_LENGTH);
}

async function findExistingMaterializedCampaign(
  storeId: string | null,
  code: string
): Promise<NewsletterCampaign | null> {
  return db.newsletterCampaign.findFirst({
    where: { storeId, code },
  });
}

/**
 * Matérialise un `MarketingIntent` APPROVED compatible newsletter en
 * `NewsletterCampaign` DRAFT. Idempotent via `code = mi-${intentId}` +
 * `@@unique([storeId, code])` — un rejeu retourne la campagne existante.
 * Ne crée aucun `NewsletterCampaignRecipient`, ne déclenche aucun envoi,
 * ne modifie pas le statut de l'intent.
 */
export async function materializeMarketingIntentAsNewsletterCampaign(
  input: MaterializeMarketingIntentAsNewsletterCampaignInput
): Promise<MaterializeMarketingIntentAsNewsletterCampaignResult> {
  const intent = await db.marketingIntent.findUnique({
    where: { id: input.intentId },
  });

  if (intent === null) {
    return { status: "not_found", newsletterCampaign: null };
  }

  if (intent.status !== "APPROVED") {
    return {
      status: "invalid_status",
      newsletterCampaign: null,
      currentStatus: intent.status,
    };
  }

  if (!intent.suggestedChannels.includes(NEWSLETTER_CHANNEL)) {
    return { status: "channel_not_suggested", newsletterCampaign: null };
  }

  const code = buildMaterializedNewsletterCampaignCode(intent.id);
  const existingCampaign = await findExistingMaterializedCampaign(intent.storeId, code);

  if (existingCampaign !== null) {
    return { status: "already_materialized", newsletterCampaign: existingCampaign };
  }

  const title = getCampaignTitle(intent);
  const link = getSourceLink(intent);

  try {
    const newsletterCampaign = await db.newsletterCampaign.create({
      data: {
        storeId: intent.storeId,
        code,
        name: title.length > 0 ? title : DEFAULT_CAMPAIGN_NAME,
        subjectLine: title.length > 0 ? title : DEFAULT_CAMPAIGN_NAME,
        bodyHtml: buildBodyHtml(title, link),
        bodyText: buildBodyText(title, link),
        status: "DRAFT",
      },
    });

    return { status: "created", newsletterCampaign };
  } catch (error: unknown) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const concurrentCampaign = await findExistingMaterializedCampaign(intent.storeId, code);

    if (concurrentCampaign === null) {
      throw error;
    }

    return { status: "already_materialized", newsletterCampaign: concurrentCampaign };
  }
}
